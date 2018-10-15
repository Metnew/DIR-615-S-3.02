'use strict';
angular.module('app').controllerProvider.register('networkStatsCtrl', [
  '$scope',
  'devinfo',
  'ngDialog',
  'funcs',
  'translate',
  function($scope, devinfo, ngDialog, funcs, translate) {
    function subscribeInfo() {
      devinfo.init({ need_auth: !0 }),
        devinfo.onceAndSubscribe(rpc, onNetworkInfoLoaded, $scope);
    }
    function onNetworkInfoLoaded(response) {
      ($scope.networkStats = response[104]
        ? _.values(_.omit(response[104], 'status'))
        : []),
        ($scope.portStats = response[129] ? response[129] : []),
        $scope.$emit('pageload');
    }
    function mapModelToViewModel(model) {
      return _.extend(_.clone(model), {
        contype: getConnType(model.contype),
        constatus: getConnStatus(model.connection_status),
        ipv4: $scope.isIpv4(model) ? model.ip : null,
        ipv6: funcs.is.ipv6Network(model.ip) ? model.ip : model.ipv6,
        rxtx: $scope.getRxTxString(model),
        rxtx_pkt: $scope.getRxTxPktString(model),
        rxtx_errs: $scope.getRxTxErrorsString(model),
        portStatus: getPortStatus(model.port),
      });
    }
    function getConnType(contype) {
      var list = funcs.getContypeList();
      return list[contype];
    }
    function getConnStatus(status) {
      var list = funcs.getConstateList();
      return list[status];
    }
    function getPortStatus(port) {
      if (!port) return null;
      var portStr;
      if (-1 == port.indexOf(':')) portStr = port.toLowerCase();
      else {
        var arr = port.split(':');
        portStr = ('port' + arr[1]).toLowerCase();
      }
      if (!$scope.portStats[portStr]) return null;
      var status = $scope.portStats[portStr].status;
      return status ? 'on' : 'off';
    }
    var rpc = '104|129';
    ($scope.getRxTxString = function(item) {
      function sizeTranslater(value) {
        return translate('size_' + value);
      }
      function getValue(value) {
        return _.isFinite(value) && value > 0
          ? funcs.lookSize(value).toString(sizeTranslater)
          : '-';
      }
      if ((_.isEmpty(item.rx) && _.isEmpty(item.tx)) || 'up' != item.state)
        return null;
      parseInt(item.rx), parseInt(item.tx);
      return getValue(item.rx) + ' / ' + getValue(item.tx);
    }),
      ($scope.getRxTxPktString = function(item) {
        return (_.isEmpty(item.rx_pkt) && _.isEmpty(item.tx_pkt)) ||
          'up' != item.state
          ? null
          : item.rx_pkt + ' / ' + item.tx_pkt;
      }),
      ($scope.needShowRxTxErrors = function() {
        return (
          $scope.networkStats &&
          $scope.networkStats[0] &&
          'undefined' != $scope.networkStats[0].rx_errs &&
          'undefined' != $scope.networkStats[0].tx_errs
        );
      }),
      ($scope.getRxTxErrorsString = function(item) {
        return (_.isEmpty(item.rx_errs) && _.isEmpty(item.tx_errs)) ||
          'up' != item.state
          ? null
          : item.rx_errs + ' / ' + item.tx_errs;
      }),
      ($scope.getIp4WithMask = function(item) {
        if (!item.ip && !item.mask) return '-';
        var ip = item.ip || '-',
          mask = item.mask ? funcs.ipv4.mask['short'](item.mask) : '-';
        return ip + '/' + mask;
      }),
      ($scope.getIp6WithMask = function(item) {
        var res = item.ip ? item.ip : !!item.ipv6;
        return res;
      }),
      ($scope.getIpv6 = function(item) {
        return funcs.is.ipv6Network(item.ip) ? item.ip : item.ipv6;
      }),
      ($scope.getIpv6Gw = function(item) {
        return funcs.is.ipv6(item.gw) ? item.gw : item.gwipv6;
      }),
      ($scope.isIpv4 = function(item) {
        return funcs.is.ipv4(item.ip);
      }),
      ($scope.isIpv6 = function(item) {
        return funcs.is.ipv6Network(item.ip) || !!item.ipv6;
      }),
      ($scope.getShortTitle = function(item) {
        return (
          '<span class="' +
          ('up' == item.state ? 'green' : 'red') +
          '">' +
          item.name +
          '</span>'
        );
      }),
      ($scope.showDetails = function(item) {
        devinfo.suspend();
        var dlg = ngDialog.open({
          template: 'dialogs/stats/net_stat_details/dialog.tpl.html',
          controller: 'netStatDetailsCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/stats/net_stat_details/ctrl.lazy.js',
            'netStatDetailsCtrl'
          ),
          data: { header: item.name, model: mapModelToViewModel(item) },
        });
        dlg.closePromise.then(function() {
          devinfo.resume();
        });
      }),
      subscribeInfo();
  },
]);
