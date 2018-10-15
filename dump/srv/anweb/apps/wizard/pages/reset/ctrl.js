'use strict';
angular.module('wizard').controller('wizardResetCtrl', [
  '$scope',
  'somovd',
  'translate',
  '$timeout',
  '$state',
  function($scope, somovd, translate, $timeout, $state) {
    var device = $scope.device;
    ($scope.ok = function() {
      $scope.showOverlay(!0),
        $state
          .go('reboot_status', { action: 'reset', next: 'info' })
          .then(device.system.reset())
          .then(function() {
            $scope.showOverlay(!1);
          });
    }),
      ($scope.cancel = function() {
        $scope.exitFromWizard();
      }),
      somovd.read(112, function(response) {
        var modeInfo = response.data;
        ($scope.hasHwModeSwitch =
          modeInfo && modeInfo.devmode_hw_switch_support),
          ($scope.deviceMode = modeInfo ? modeInfo.device_mode : '');
      }),
      ($scope.getConfigResetMessage = function() {
        return translate(
          $scope.hasHwModeSwitch && $scope.deviceMode
            ? 'wizard_reset_' + $scope.deviceMode
            : 'wizard_reset'
        );
      });
  },
]);
