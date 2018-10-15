'use strict';
function _typeof(obj) {
  return obj && 'undefined' != typeof Symbol && obj.constructor === Symbol
    ? 'symbol'
    : typeof obj;
}
angular.module('app').controllerProvider.register('RoutingCtrl', [
  '$scope',
  'somovd',
  'ngDialog',
  'funcs',
  '$state',
  'snackbars',
  'translate',
  'routingConstants',
  function(
    $scope,
    somovd,
    ngDialog,
    funcs,
    $state,
    snackbars,
    translate,
    constants
  ) {
    function init() {
      function initCallback(data) {
        return funcs.is.RPCSuccess(data.rq[0]) &&
          funcs.is.RPCSuccess(data.rq[2])
          ? (($scope.routes = data.rq[0].data.route),
            ($scope.ipv6Avail = !isError(data.rq[1])),
            ($scope.ifacesList = getIfacesList(
              data.rq[2].data,
              $scope.ipv6Avail
            )),
            ($scope.hwIPv6Route.data =
              data.rq[3] && data.rq[3].data ? data.rq[3].data : void 0),
            (__backupHwIpv6Route = angular.copy($scope.hwIPv6Route)),
            $scope.$emit('pageload'),
            void ($scope.isActivate = !0))
          : void $state.go('error', {
              code: 'pullError',
              message: 'pullErrorDesc',
            });
      }
      $scope.isActivate = !1;
      var readArr = [17, 132, 120];
      constants.rlx819xHwIPv6 && readArr.push(251),
        somovd.read(readArr, initCallback);
    }
    function getIfacesList(data, supportV6) {
      var ifaces = _.filter(data.iface_names, function(item) {
        return (
          (supportV6 || item.type.indexOf('v6') < 0) && 'auto' != item.type
        );
      })
        .map(function(item) {
          return {
            name: item.name,
            iface: item.iface,
            gwif: item.gwif,
            gwifv6: item.gwifv6,
          };
        })
        .reverse();
      return (
        ifaces.unshift({
          name: translate('routing_auto_iface'),
          iface: 'auto',
        }),
        ifaces
      );
    }
    function openDialog(pos, route, isNew) {
      ngDialog
        .open({
          template: 'dialogs/routing_form/dialog.tpl.html',
          className: 'ddns_dialog',
          controller: 'RoutingDialogCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/routing_form/ctrl.lazy.js',
            'RoutingDialogCtrl'
          ),
          data: {
            routes: $scope.routes,
            pos: pos,
            route: route,
            isNew: isNew,
            ifacesList: $scope.ifacesList,
            isSupportIPv6: $scope.ipv6Avail,
          },
          scope: $scope,
        })
        .closePromise.then(function(data) {
          'saved' === data.value && init();
        });
    }
    function isError(data) {
      return (
        'object' !==
          ('undefined' == typeof data ? 'undefined' : _typeof(data)) ||
        !('status' in data) ||
        data.status >= 50
      );
    }
    init(),
      ($scope.constants = constants),
      ($scope.hwIPv6Route = { data: null });
    var __backupHwIpv6Route = null;
    ($scope.add = function() {
      openDialog(-1, { iface: 'auto', gw: '' }, !0);
    }),
      ($scope.edit = function(key, item) {
        openDialog(item, key, !1);
      }),
      ($scope.remove = function(items, keys) {
        function getRemoveList() {
          return keys
            .sort()
            .reverse()
            .map(keysMapper);
        }
        function keysMapper(key) {
          return { id: 17, pos: key, data: {} };
        }
        function cb(response) {
          return (
            init(),
            funcs.is.allRPCSuccess(response)
              ? void snackbars.add('rpc_remove_success')
              : (snackbars.add('rpc_remove_error'), null)
          );
        }
        somovd.remove(getRemoveList(), cb);
      }),
      ($scope.getSubnet = function(route) {
        return route.ip + '/' + IP.getMaskLength(route.netmask);
      }),
      ($scope.isEmptyRules = function() {
        return $scope.routes && 0 == $scope.routes.length;
      }),
      ($scope.getIfaceName = function(item) {
        var iface;
        return (
          funcs.is.ipv4(item.ip) &&
            'auto' != item.iface &&
            (iface =
              _.findWhere($scope.ifacesList, { iface: item.iface, gwif: !0 }) ||
              _.findWhere($scope.ifacesList, { iface: item.iface, gwif: !1 })),
          (funcs.is.ipv6(item.ip) ||
            (funcs.is.ipv6Network(item.ip) && 'auto' != item.iface)) &&
            (iface =
              _.findWhere($scope.ifacesList, {
                iface: item.iface,
                gwifv6: !0,
              }) ||
              _.findWhere($scope.ifacesList, {
                iface: item.iface,
                gwifv6: !1,
              })),
          (funcs.is.ipv6(item.ip) ||
            (funcs.is.ipv6Network(item.ip) && 'auto' == item.iface)) &&
            (iface = _.findWhere($scope.ifacesList, { iface: item.iface })),
          funcs.is.ipv4(item.ip) &&
            'auto' == item.iface &&
            (iface = _.findWhere($scope.ifacesList, { iface: item.iface })),
          iface ? iface.name : ''
        );
      }),
      ($scope.hwIPv6WasModifed = function() {
        return (
          __backupHwIpv6Route &&
          !funcs.deepEqual(__backupHwIpv6Route, $scope.hwIPv6Route)
        );
      }),
      ($scope.applyHwRoute = function() {
        function writeCb(response) {
          return funcs.is.RPCSuccess(response) ? void init() : void error();
        }
        function error() {
          $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
        }
        somovd.write(251, $scope.hwIPv6Route.data, -1, writeCb);
      });
  },
]);
