'use strict';
!(function() {
  function WifiAPSettings($scope, $state, constants, device, cookie) {
    function activate() {
      var band = device.wifi.getBand(0),
        ap = band.ap;
      if (((standards = band.radio.OperatingStandards), isEdit())) {
        var inx = $state.params.inx;
        $scope.wifi.ap.data = ap.get(inx);
      } else if (isAdd()) {
        var inx = ap.add(ap.getDefault());
        $scope.wifi.ap.data = ap.get(inx);
      } else $scope.wifi.ap.data = ap.getBase();
      ($scope.BandwidthRestricted.enable =
        0 != $scope.wifi.ap.data.BandwidthRestricted),
        (backupData = angular.copy($scope.wifi.ap.data));
    }
    function supportedParam(param, subPath) {
      var band = device.wifi.getBand(0),
        root = subPath ? subPath + '.' : '';
      return band.ap.supportedParam(param, root);
    }
    function supportedModes() {
      if (!$scope.wifi.ap.data) return [];
      var operatingStands =
          $scope.wifi.general &&
          $scope.wifi.general.data &&
          $scope.wifi.general.data.OperatingStandards
            ? $scope.wifi.general.data.OperatingStandards
            : standards,
        modesTemplate = helper.getTempModes(operatingStands),
        modesSupported = $scope.wifi.ap.data.Security.ModesSupported.split(',');
      return _.filter(modesTemplate, function(obj) {
        return ~_.indexOf(modesSupported, obj.value);
      });
    }
    function showSecurity(type) {
      return helper.checkSecurityType(type, $scope.wifi.ap.data, standards);
    }
    function showPreAuth(mode) {
      return 'WPA2-Enterprise' == mode || 'WPA-WPA2-Enterprise' == mode;
    }
    function isOpen() {
      return helper.isOpen($scope.wifi.ap.data);
    }
    function getWEPTypes() {
      return helper.getWEPTypes();
    }
    function getEncrypTypes() {
      return helper.getEncrypTypes($scope.wifi.ap.data, standards);
    }
    function getDefaultKeysID() {
      return helper.getDefaultKeysID();
    }
    function changeEncrypType(types) {
      if (types && $scope.wifi.ap.data) {
        var encr = $scope.wifi.ap.data.Security.EncryptionType;
        _.contains(types, encr) ||
          ($scope.wifi.ap.data.Security.EncryptionType = types[0]);
      }
    }
    function changeBandwidthRestricted(value) {
      !$scope.wifi.ap.data ||
        _.isNull(value) ||
        _.isUndefined(value) ||
        (value
          ? $scope.BandwidthRestrictedBackup &&
            (($scope.wifi.ap.data.BandwidthRestricted = angular.copy(
              $scope.BandwidthRestrictedBackup
            )),
            ($scope.BandwidthRestrictedBackup = null))
          : (($scope.BandwidthRestrictedBackup = angular.copy(
              $scope.wifi.ap.data.BandwidthRestricted
            )),
            ($scope.wifi.ap.data.BandwidthRestricted = _.isUndefined(
              $scope.wifi.ap.data.BandwidthRestricted
            )
              ? void 0
              : 0)));
    }
    function validPSKKey(pskKey) {
      return helper.validPSKKey(pskKey);
    }
    function getWEPKeyLenMessage() {
      return $scope.wifi.ap.data
        ? helper.getWEPKeyLenMessage($scope.wifi.ap.data)
        : null;
    }
    function validWEPKey(wepKey) {
      return $scope.wifi.ap.data
        ? helper.validWEPKey(wepKey, $scope.wifi.ap.data)
        : null;
    }
    function isEdit() {
      return 'edit' === action;
    }
    function isAdd() {
      return 'add' === action;
    }
    function isChange() {
      return _.size(device.funcs.getChanges($scope.wifi.ap.data, backupData));
    }
    function isShowGuestAccess() {
      var inx = $state.params.inx;
      return (
        '1' != inx &&
        'common' != action &&
        constants.SUPPORT_GUEST_ACCESS &&
        !isAPMode
      );
    }
    function isSupportNSG() {
      return isShowGuestAccess() && constants.SUPPORT_NSG_SERVICE;
    }
    function initNSG() {
      _.isUndefined(backupData.NSG) &&
        (backupData.NSG = $scope.wifi.ap.data.NSG = !1);
    }
    var helper = device.wifi.helper,
      action = $state.current.name.split('.').pop(),
      freq = $state.params.freq,
      isAPMode = 'ap' === cookie.get('device_mode'),
      standards = null,
      backupData = null;
    ($scope.wifi.ap = {
      data: null,
      supportedParam: supportedParam,
      supportedModes: supportedModes,
      showSecurity: showSecurity,
      showPreAuth: showPreAuth,
      getWEPTypes: getWEPTypes,
      getEncrypTypes: getEncrypTypes,
      getDefaultKeysID: getDefaultKeysID,
      validWEPKey: validWEPKey,
      validPSKKey: validPSKKey,
      getWEPKeyLenMessage: getWEPKeyLenMessage,
      isOpen: isOpen,
      isEdit: isEdit,
      isAdd: isAdd,
      isChange: isChange,
      isShowGuestAccess: isShowGuestAccess,
      isSupportNSG: isSupportNSG,
      initNSG: initNSG,
      changeBandwidthRestricted: changeBandwidthRestricted,
    }),
      ($scope.BandwidthRestricted = {
        enable: null,
        min: '1',
        max: '2.4GHz' == freq ? '150' : '450',
      }),
      $scope.$watch(getEncrypTypes, changeEncrypType, !0),
      $scope.$watch(
        'wifi.advancedAp.bandwidthRestrictedEnable',
        changeBandwidthRestricted
      ),
      activate();
  }
  angular
    .module('app')
    .controller('WifiAPSettings', [
      '$scope',
      '$state',
      'wifiAPConstants',
      'device',
      'cookie',
      WifiAPSettings,
    ]);
})();
