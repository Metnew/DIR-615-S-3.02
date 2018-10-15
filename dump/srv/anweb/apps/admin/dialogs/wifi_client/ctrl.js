'use strict';
function WifiClientDialogCtrl($scope, $element, translate) {
  function initData(point, client) {
    var isCurrent = ($scope.isCurrent =
      point.BSSID == client.BSSID && point.Band == client.Band);
    return {
      SSID: point.SSID,
      BSSID: point.BSSID,
      Band: isCurrent ? client.Band : point.Band,
      AdvancedChannel: point.AdvancedChannel,
      Security: {
        ModeEnabled: point.ModeEnabled,
        EncryptionType: point.EncryptionType,
        PreSharedKey: isCurrent ? client.Security.PreSharedKey : '',
        WEPKey1: isCurrent ? client.Security.WEPKey1 : '',
        WEPKey2: isCurrent ? client.Security.WEPKey2 : '',
        WEPKey3: isCurrent ? client.Security.WEPKey3 : '',
        WEPKey4: isCurrent ? client.Security.WEPKey4 : '',
        OpenWEP: isCurrent ? client.Security.OpenWEP : !1,
        OpenWEPType: isCurrent ? client.Security.OpenWEPType : 'WEP-64',
        DefaultKeyID: isCurrent
          ? client.Security.DefaultKeyID
          : getDefaultKeysID()[0],
        WEPasHEX: isCurrent ? client.Security.WEPasHEX : !1,
      },
      MacAddressClone: client.MacAddressClone,
    };
  }
  function apply() {
    if (!$scope.form.$invalid) {
      var data = {
        ep: $scope.dialog.data,
        radio: {
          Band: $scope.dialog.info.Band,
          Channel: $scope.dialog.info.Channel,
        },
      };
      $scope.closeThisDialog(data);
    }
  }
  function cancel() {
    $scope.closeThisDialog(null);
  }
  function getSignalStrength(strength) {
    return strength + '%';
  }
  function showSecurity(type) {
    return helper.checkSecurityType(type, $scope.dialog.data);
  }
  function getWEPTypes() {
    return helper.getWEPTypes();
  }
  function getDefaultKeysID() {
    return helper.getDefaultKeysID();
  }
  function getIncorrectModeNotice() {
    var mode = $scope.dialog.data.Security.ModeEnabled;
    return (
      translate(wifiClientIncorrectNetworkNotice1) +
      ' ' +
      mode +
      ' ' +
      translate(wifiClientIncorrectNetworkNotice2)
    );
  }
  function isOpen() {
    var mode = $scope.dialog.data.Security.ModeEnabled;
    return 'None' == mode;
  }
  function isWPAEnterprice() {
    var mode = $scope.dialog.data.Security.ModeEnabled;
    return (
      'WPA-Enterprise' == mode ||
      'WPA2-Enterprise' == mode ||
      'WPA-WPA2-Enterprise' == mode
    );
  }
  function validPSKKey(pskKey) {
    return helper.validPSKKey(pskKey);
  }
  function getWEPKeyLenMessage() {
    return $scope.dialog.data
      ? helper.getWEPKeyLenMessage($scope.dialog.data)
      : null;
  }
  function validWEPKey(wepKey) {
    return $scope.dialog.data
      ? helper.validWEPKey(wepKey, $scope.dialog.data)
      : null;
  }
  {
    var device = $scope.device,
      helper = device.wifi.helper;
    $scope.client;
  }
  $scope.dialog = {
    info: angular.copy($scope.ngDialogData.pointData),
    data: initData(
      $scope.ngDialogData.pointData,
      $scope.ngDialogData.clientData
    ),
    apply: apply,
    cancel: cancel,
    showAdvanced: !1,
    getSignalStrength: getSignalStrength,
    showSecurity: showSecurity,
    getWEPTypes: getWEPTypes,
    getDefaultKeysID: getDefaultKeysID,
    getIncorrectModeNotice: getIncorrectModeNotice,
    isOpen: isOpen,
    isWPAEnterprice: isWPAEnterprice,
    validPSKKey: validPSKKey,
    validWEPKey: validWEPKey,
    getWEPKeyLenMessage: getWEPKeyLenMessage,
  };
}
