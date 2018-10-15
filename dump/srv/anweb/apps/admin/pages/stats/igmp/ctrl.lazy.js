'use strict';
angular.module('app').controllerProvider.register('igmpStatsCtrl', [
  '$scope',
  'devinfo',
  'funcs',
  'ngDialog',
  function($scope, devinfo, funcs, ngDialog) {
    function subscribeInfo() {
      devinfo.onceAndSubscribe(rpc, onInfoLoaded, $scope);
    }
    function onInfoLoaded(response) {
      var igmpStats = response ? response[rpc] : {};
      ($scope.igmpGroupTypes = []),
        $scope.igmpGroupTypes.push({
          name: 'IPv4',
          items: igmpStats.igmp || [],
        }),
        SUPPORT_IPV6 &&
          $scope.igmpGroupTypes.push({
            name: 'IPv6',
            items: igmpStats.igmp6 || [],
          }),
        $scope.$emit('pageload');
    }
    var SUPPORT_IPV6 = !0,
      rpc = '206';
    ($scope.getShortRowTitle = function(item) {
      return _.isEmpty(item.maddr) ? '-' : item.maddr.join(', ');
    }),
      subscribeInfo();
  },
]);
