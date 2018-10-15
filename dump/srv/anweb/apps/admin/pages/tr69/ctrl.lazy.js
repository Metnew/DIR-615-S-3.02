'use strict';
angular.module('app').controllerProvider.register('Tr69Ctrl', [
  '$scope',
  'somovd',
  'funcs',
  'snackbars',
  function($scope, somovd, funcs, snackbars) {
    function getIfaces(tree) {
      var result = {};
      return (
        _.each(tree, function(iface, ifname) {
          (iface.ifname = ifname),
            _.each(iface.services, function(service, ifname) {
              'auto' != service.type &&
                (result[service.name] = {
                  iface: service.iface,
                  l2_key: iface.ifname,
                  l3_key: ifname,
                }),
                _.each(service.tunnels, function(tunnel, ifname) {
                  result[tunnel.name] = {
                    iface: tunnel.iface,
                    l2_key: iface.ifname,
                    l3_key: ifname,
                  };
                });
            });
        }),
        result
      );
    }
    function getCurrentIface() {
      function isCurrent(iface) {
        return (
          iface.iface === $scope.tr69.iface &&
          iface.l2_key === $scope.tr69.l2_key &&
          iface.l3_key === $scope.tr69.l3_key
        );
      }
      for (var i in $scope.ifaces) if (isCurrent($scope.ifaces[i])) return i;
      return 'wan_auto';
    }
    ($scope.BCM = 'undefined' != typeof BCM),
      ($scope.BRCM_CMS_BUILD = 'undefined' != typeof BRCM_CMS_BUILD),
      ($scope.DLINK_TR069CLIENT_USE_DSCP_SOCKOPT =
        'undefined' != typeof DLINK_TR069CLIENT_USE_DSCP_SOCKOPT);
    var __backupTr69 = null,
      __backupTmp = null;
    !(function() {
      function initCallback(data) {
        ($scope.tr69 = data.rq[1].data),
          ($scope.ifaces = getIfaces(data.rq[0].data.iface_names)),
          ($scope.ifaces.wan_auto = { iface: 'ANY_WAN' }),
          ($scope.ifacesList = Object.keys($scope.ifaces)),
          ($scope.tmp = { iface: getCurrentIface() }),
          (__backupTmp = angular.copy($scope.tmp)),
          (__backupTr69 = angular.copy($scope.tr69)),
          $scope.$emit('pageload');
      }
      somovd.read([1, 70], initCallback);
    })(),
      ($scope.isDisabledSubmit = function() {
        return $scope.tr69Form.$pristine;
      }),
      ($scope.wasModified = function() {
        return (
          (__backupTmp && !_.isEqual(__backupTmp, angular.copy($scope.tmp))) ||
          (__backupTr69 && !_.isEqual(__backupTr69, angular.copy($scope.tr69)))
        );
      }),
      ($scope.save = function() {
        function writeCb(response) {
          return funcs.is.allRPCSuccess(response)
            ? ((__backupTmp = angular.copy($scope.tmp)),
              (__backupTr69 = angular.copy($scope.tr69)),
              void snackbars.add('rpc_write_success'))
            : void snackbars.add('rpc_write_error');
        }
        $scope.tr69Form.$invalid ||
          (_.extend($scope.tr69, $scope.ifaces[$scope.tmp.iface]),
          ($scope.tr69.InformInterval += ''),
          somovd.write(70, $scope.tr69, writeCb));
      }),
      ($scope.getDSCPMarkList = function() {
        return [
          { name: 'CS0', value: 0 },
          { name: 'CS1', value: 1 },
          { name: 'CS2', value: 2 },
          { name: 'CS3', value: 3 },
          { name: 'CS4', value: 4 },
          { name: 'CS5', value: 5 },
          { name: 'CS6', value: 6 },
          { name: 'CS7', value: 7 },
          { name: 'EF', value: 8 },
        ];
      });
  },
]);
