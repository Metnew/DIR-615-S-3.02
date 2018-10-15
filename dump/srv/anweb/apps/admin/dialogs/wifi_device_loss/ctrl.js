'use strict';
function WifiDeviceLossDialogCtrl($rootScope, $scope, $timeout, translate) {
  var data = $scope.ngDialogData;
  ($scope.getCommentTitle = function() {
    var msg = '';
    return (
      _.contains(data.reason, 'ssid') &&
        (msg += translate('wifiDeviceLossSSID') + '. '),
      _.contains(data.reason, 'security_mode') &&
        (msg += translate('wifiDeviceLossSecurityMode') + '. '),
      _.contains(data.reason, 'security_encryption') &&
        (msg += translate('wifiDeviceLossSecurityEncryption') + '. '),
      (msg += translate('wifiDeviceLossReconnect') + '.\n')
    );
  }),
    ($scope.getCommentParam = function() {
      return translate('wifiDeviceLossParams') + ':\n';
    }),
    ($scope.getParams = function() {
      function getKey(name) {
        var keyMap = {
          SSID: 'wifiSSID',
          ModeEnabled: 'wifiMode',
          PreSharedKey: 'wifiPSKKey',
        };
        return /WEPKey*/.test(name) ? 'wifi' + name : keyMap[name];
      }
      function addRow(key, value) {
        var title =
            "<div class='dialog_row__title'>" + translate(key) + ':</div>',
          info = "<div class='dialog_row__info'>" + value + '</div>';
        return "<div class='dialog_row'>" + title + info + '</div>';
      }
      var msg = '';
      return (
        _.each(data.params, function(value, name) {
          var key = getKey(name);
          msg += addRow(key, value);
        }),
        msg
      );
    }),
    ($scope.skip = function() {
      $scope.closeThisDialog();
    }),
    $timeout(function() {
      function setDeviceNotAvailable() {
        $scope.deviceAvailable = !1;
      }
      function setDeviceAvailableAgain() {
        $scope.deviceAvailable = !0;
      }
      var eventDeviceNotAvailable = $rootScope.$on(
          'device.state.not_available',
          setDeviceNotAvailable
        ),
        eventDeviceAvailableAgain = $rootScope.$on(
          'device.state.available_again',
          setDeviceAvailableAgain
        ),
        eventDeviceAvailableAgain2 = $rootScope.$on(
          'device_available_again',
          setDeviceAvailableAgain
        ),
        eventDeviceDefinitlyLost = $rootScope.$on(
          'device_definitly_lost',
          setDeviceNotAvailable
        ),
        eventDevicePossiblyLost = $rootScope.$on(
          'device_possibly_lost',
          setDeviceNotAvailable
        );
      setDeviceAvailableAgain(),
        $scope.$on('$destroy', function() {
          eventDeviceNotAvailable(),
            eventDeviceAvailableAgain(),
            eventDeviceAvailableAgain2(),
            eventDeviceDefinitlyLost(),
            eventDevicePossiblyLost();
        });
    });
}
WifiDeviceLossDialogCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$timeout',
  'translate',
];
