'use strict';
!(function() {
  function DmzCtrl($scope, $state, somovd, constants, funcs, devinfo) {
    function activate() {
      somovd.read(constants.CONFIG_ID_DMZ, function(response) {
        return isRPCSuccess(response.status)
          ? ((dmz.data = response.data.dmz ? response.data.dmz : response.data),
            (__backupRule = angular.copy(dmz.data)),
            (dmz.isActivate = !0),
            $scope.$emit('pageload'),
            void (
              overlayId &&
              ($scope.overlay.circular.stop(overlayId), (overlayId = null))
            ))
          : void $state.go('error', {
              code: 'pullError',
              message: 'pullErrorDesc',
            });
      }),
        devinfo.once('net').then(function(data) {
          $scope.dmz.lans = data.lan;
        });
    }
    function showIpWarning() {
      return (
        $scope.dmz.data &&
        $scope.dmz.data.enable &&
        funcs.is.ipv4($scope.dmz.data.ip) &&
        !isLanIp($scope.dmz.data.ip, $scope.dmz.lans)
      );
    }
    function isLanIp(ip, lans) {
      function getIPv4validator(lan) {
        var range = funcs.ipv4.subnet.getNetworkRange(lan.ip, lan.mask);
        return function(addr) {
          return funcs.ipv4.subnet.belongNetworkRange(range, addr);
        };
      }
      var lanCheckers = _.map(lans, getIPv4validator);
      return _.some(lanCheckers, function(checkLan) {
        return checkLan(ip);
      });
    }
    function apply() {
      (overlayId = $scope.overlay.circular.start()),
        $scope.form.$invalid ||
          (dmz.data.enable ||
            ((dmz.data = _.extend(dmz.data, __backupRule)),
            (dmz.data.enable = !1)),
          somovd.write(constants.CONFIG_ID_DMZ, dmz.data, -1, function(
            response
          ) {
            return isRPCSuccess(response.status)
              ? void activate()
              : void $state.go('error', {
                  code: 'pushError',
                  message: 'pushErrorDesc',
                });
          }));
    }
    function useEnableSNAT() {
      return constants.USE_LOOPBACK_SNAT;
    }
    function wasModified() {
      return __backupRule && !_.isEqual(__backupRule, dmz.data);
    }
    function isRPCSuccess(status) {
      return (
        status == constants.RPC_OK ||
        status == constants.RPC_NEED_SAVE ||
        status == constants.RPC_NEED_REBOOT
      );
    }
    $scope.dmz = {
      isActivate: !1,
      data: null,
      apply: apply,
      useEnableSNAT: useEnableSNAT,
      wasModified: wasModified,
      showIpWarning: showIpWarning,
    };
    var dmz = $scope.dmz,
      __backupRule = null,
      overlayId = null;
    activate();
  }
  angular
    .module('app')
    .controllerProvider.register('DmzCtrl', [
      '$scope',
      '$state',
      'somovd',
      'dmzConstants',
      'funcs',
      'devinfo',
      DmzCtrl,
    ]);
})();
