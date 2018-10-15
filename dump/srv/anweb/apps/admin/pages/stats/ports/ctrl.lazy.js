'use strict';
angular.module('app').controllerProvider.register('portStatsCtrl', [
  '$scope',
  'devinfo',
  '$state',
  function($scope, devinfo, $state) {
    function subscribeInfo() {
      devinfo.onceAndSubscribe(rpc, onInfoLoaded, $scope);
    }
    function onInfoLoaded(response) {
      ($scope.portStats = response ? response[rpc] : {}),
        $scope.$emit('pageload');
    }
    var rpc = '129';
    ($scope.showDetails = function(item, key) {
      $state.go('stats.portDetails', { portAlias: item.alias.toLowerCase() });
    }),
      ($scope.bytesToMbytes = function(value) {
        return Math.floor(value / 1048576);
      }),
      subscribeInfo();
  },
]);
