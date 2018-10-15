'use strict';
angular
  .module('app')
  .controllerProvider.register('RoutingDialogCtrl', function(
    $scope,
    somovd,
    funcs,
    snackbars
  ) {
    function isFormValid() {
      function emptyFields() {
        return requiredFields.some(function(field) {
          return !$scope.route[field];
        });
      }
      var requiredFields = ['ip'];
      return (
        'ipv4' === $scope.protocol.value && requiredFields.push('netmask'),
        !$scope.routing_form.$invalid && !$scope.isConfict() && !emptyFields()
      );
    }
    function gatewayRequired() {
      return 'auto' == $scope.route.iface;
    }
    var pos = $scope.ngDialogData.pos,
      routes = $scope.ngDialogData.routes,
      route = ($scope.route = angular.copy($scope.ngDialogData.route)),
      isNew = $scope.ngDialogData.isNew,
      isSupportIPv6 = ($scope.isSupportIPv6 =
        $scope.ngDialogData.isSupportIPv6),
      backup = {};
    ($scope.header = 'routing_' + (isNew ? 'add' : 'edit')),
      ($scope.protocol = {}),
      ($scope.protocol.value =
        funcs.is.ipv6Network(route.ip) | funcs.is.ipv6(route.ip)
          ? 'ipv6'
          : 'ipv4'),
      ($scope.protocol.list = ['ipv4']),
      isSupportIPv6 && $scope.protocol.list.push('ipv6'),
      ($scope.ifacesList = $scope.ngDialogData.ifacesList),
      ($scope.gatewayRequired = gatewayRequired),
      $scope.$watch('protocol.value', function() {
        var temp;
        'ipv4' == $scope.protocol.value &&
          (temp = _.findWhere($scope.ngDialogData.ifacesList, { gwifv6: !0 })),
          'ipv6' == $scope.protocol.value &&
            (temp = _.findWhere($scope.ngDialogData.ifacesList, { gwif: !0 })),
          ($scope.ifacesList = _.without($scope.ngDialogData.ifacesList, temp));
      }),
      $scope.$watch('protocol.value', function(version, oldVersion) {
        (backup[oldVersion] = angular.copy({
          ip: route.ip,
          netmask: route.netmask,
          gw: route.gw,
        })),
          backup[version]
            ? ((route.ip = angular.copy(backup[version].ip)),
              (route.netmask = angular.copy(backup[version].netmask)),
              (route.gw = angular.copy(backup[version].gw)))
            : ((route.ip = ''), (route.netmask = ''), (route.gw = ''));
      }),
      ($scope.save = function() {
        function writeCb(response) {
          return funcs.is.allRPCSuccess(response)
            ? (snackbars.add('rpc_write_success'),
              void $scope.closeThisDialog('saved'))
            : void snackbars.add('rpc_write_error');
        }
        isFormValid() &&
          (route.met || delete route.met,
          somovd.write(17, route, pos, writeCb));
      }),
      ($scope.isSavingDisabled = function() {
        return $scope.routing_form.$pristine;
      }),
      ($scope.isConfict = function() {
        return _.some(routes, function(elem, index) {
          return index == pos
            ? !1
            : elem.ip == route.ip && elem.netmask == route.netmask;
        });
      });
  });
