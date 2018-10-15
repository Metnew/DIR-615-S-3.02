'use strict';
angular.module('app').controllerProvider.register('sessionStatsCtrl', [
  '$scope',
  'devinfo',
  'funcs',
  '$timeout',
  function($scope, devinfo, funcs, $timeout) {
    function onInfoLoaded(response) {
      ($scope.sessionStats = response ? mapSessionStats(response[rpc]) : []),
        $scope.$emit('pageload'),
        $timeout(function() {
          $scope.loading = !1;
        });
    }
    function mapSessionStats(data) {
      var result = [];
      return (
        _.each(data, function(sourceItem) {
          _.each(sourceItem.protocols, function(protocolItem, protocolName) {
            _.each(protocolItem, function(dest) {
              result.push({
                sourceIp: sourceItem.source_ip,
                sourcePort: dest.source_port,
                destIp: dest.dest_ip,
                destPort: dest.dest_port,
                protocol: protocolName.toUpperCase(),
              });
            });
          });
        }),
        result
      );
    }
    var rpc = '180';
    ($scope.refreshInfo = function() {
      devinfo.once(rpc).then(onInfoLoaded);
    }),
      ($scope.getShortRowTitle = function(item) {
        return (
          item.sourceIp +
          ':<span class="light">' +
          item.sourcePort +
          '</span> — ' +
          item.destIp +
          ':<span class="light">' +
          item.destPort +
          '</span>'
        );
      }),
      ($scope.onRefreshClick = function() {
        ($scope.loading = !0), $scope.refreshInfo();
      }),
      $scope.refreshInfo();
  },
]);
