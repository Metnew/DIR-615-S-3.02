'use strict';
angular.module('app').controllerProvider.register('PortSettingsDialogCtrl', [
  '$scope',
  'PortSettingsUtil',
  'snackbars',
  function($scope, util, snackbars) {
    var port = $scope.ngDialogData.port,
      helper = util.makeHelper();
    ($scope.data = { speed: port.autonegotiation ? 'auto' : port.speed }),
      ($scope.saveSettings = function() {
        function success() {
          snackbars.add('rpc_write_success'), $scope.closeThisDialog();
        }
        function error() {
          snackbars.add('rpc_write_error');
        }
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start(),
          data = helper.prepareData(port, $scope.data.speed);
        util
          .apply(data)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }),
      ($scope.getAdvertisementKeys = function() {
        return helper.getAdvertisementKeys(port.advertisement);
      }),
      ($scope.getSpeedList = function() {
        return helper.getSpeedList(port.advertisement);
      });
  },
]);
