'use strict';
!(function() {
  angular.module('app').controller('WifiChannelSelectCtrl', [
    '$scope',
    'wifiWorkloadService',
    function($scope, wifiWorkloadService) {
      var band = $scope.ngDialogData.band;
      ($scope.selectedChannel = $scope.ngDialogData.currentChannel),
        ($scope.selectChannel = function(channel) {
          -1 != _.indexOf($scope.wifiChannelList, parseInt(channel)) &&
            (($scope.selectedChannel = channel),
            $scope.closeThisDialog({
              selected: !0,
              channel: $scope.selectedChannel,
            }));
        }),
        ($scope.getChannelClass = function(channel) {
          return channel.number == $scope.selectedChannel
            ? 'selected-green'
            : -1 == _.indexOf($scope.wifiChannelList, parseInt(channel.number))
              ? 'disabled-row'
              : void 0;
        });
      var mapChannelsWorkload = function(data) {
          return _.map(_.keys(data), function(key) {
            return { number: key, workload: data[key] };
          });
        },
        getChannelsInfo = function() {
          return wifiWorkloadService
            .getInfo(band)
            .then(
              function(response) {
                ($scope.channelsWorkload = mapChannelsWorkload(
                  response.workload
                )),
                  ($scope.wifiChannelList = response.channels);
              },
              function(params) {
                $scope.channelsWorkload = [];
              }
            )
            ['finally'](function() {
              $scope.loading = !1;
            });
        };
      ($scope.loading = !0), getChannelsInfo();
    },
  ]);
})();
