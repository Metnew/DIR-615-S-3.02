'use strict';
angular
  .module('app')
  .controllerProvider.register('PingSettings', function(
    $scope,
    translate,
    $document,
    $timeout
  ) {
    var settingsPacketsize = 56,
      settingsTimeout = 3;
    ($scope.setSettings = function() {
      $scope.pingAdditionalSettings.$invalid || $scope.closeThisDialog();
    }),
      ($scope.applyKeypress = function(event) {
        13 == event.keyCode &&
          $timeout(function() {
            $scope.setSettings();
            var elm = document.querySelector('#ping_set_settings');
            elm.focus();
          });
      }),
      ($scope.resetSettings = function() {
        ($scope.ping.packetsize = settingsPacketsize),
          ($scope.ping.timeout = settingsTimeout);
      }),
      ($scope.isInDefaultState = function() {
        return (
          $scope.ping.packetsize == settingsPacketsize &&
          $scope.ping.timeout == settingsTimeout
        );
      }),
      ($scope.isNotChanged = function() {
        return (
          $scope.ping.packetsize == $scope.ping.tmp_packetsize &&
          $scope.ping.timeout == $scope.ping.tmp_timeout
        );
      }),
      ($scope.closeSettingsDialog = function() {
        return $scope.isNotChanged()
          ? void $scope.closeThisDialog()
          : void (
              confirm(translate('discardSettingsChanges')) &&
              (($scope.ping.packetsize = $scope.ping.tmp_packetsize),
              ($scope.ping.timeout = $scope.ping.tmp_timeout),
              $scope.closeThisDialog())
            );
      });
  });
