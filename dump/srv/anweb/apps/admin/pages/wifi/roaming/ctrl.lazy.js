'use strict';
!(function() {
  function wifiRoamingCtrl($scope, $state, constants, somovd) {
    function update() {
      somovd.read(208).then(function(res) {
        ($scope.roaming = res.data.roaming),
          ($scope.backup = device.funcs.deepExtend({}, $scope.roaming)),
          $scope.$emit('pageload');
      });
    }
    var device = $scope.device;
    ($scope.roaming = {}),
      ($scope.backup = null),
      ($scope.bands = [{ name: '24', prefix: '' }]),
      constants.SUPPORT_5G && $scope.bands.push({ name: '5', prefix: '_5g' }),
      ($scope.isNotModified = function() {
        return _.size($scope.roaming) && $scope.backup
          ? angular.equals($scope.roaming, $scope.backup)
          : !0;
      }),
      ($scope.supportMultiBand = function() {
        return _.size($scope.bands) > 1;
      }),
      ($scope.apply = function(value) {
        function prepare(data) {
          return data.enable
            ? data.mc_switch
              ? data
              : _.omit(data, 'mc_ttl', 'mc_groupaddr')
            : { enable: !1 };
        }
        somovd.write(208, { roaming: prepare($scope.roaming) }, update);
      }),
      update();
  }
  angular
    .module('app')
    .controllerProvider.register('wifiRoamingCtrl', [
      '$scope',
      '$state',
      'wifiRoamingConstants',
      'somovd',
      wifiRoamingCtrl,
    ]);
})();
