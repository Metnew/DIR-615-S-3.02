'use strict';
function WiFiClientStepController(
  $scope,
  $rootScope,
  manualProfile,
  manualStepApiDispatcher,
  devinfo,
  $q,
  funcs,
  device
) {
  function getRepeaterPrefix(is5G) {
    return is5G ? '_5G_EXT' : '_EXT';
  }
  function activate() {
    ($scope.wifiClient.stepActive = !0), pullAll().then(success);
  }
  function deactivate() {
    var Security = profile.$WifiClientStep.Security;
    ($scope.wifiClient.stepActive = !1),
      pullAll().then(success),
      isWiFiRepeater() &&
        ((profile.$WiFiStep[2.4].SSID =
          profile.$WifiClientStep.SSID + getRepeaterPrefix()),
        $rootScope.rootIsSupport5G &&
          (profile.$WiFiStep[5].SSID =
            profile.$WifiClientStep.SSID + getRepeaterPrefix(!0))),
      Security &&
        Security.EncryptionType &&
        Security.PreSharedKey &&
        ((profile.$WiFiStep[2.4].PSK = Security.PreSharedKey),
        profile.$WiFiStep[5] &&
          (profile.$WiFiStep[5].PSK = Security.PreSharedKey));
  }
  function isWiFiRepeater() {
    return _.contains(
      ['Repeater', 'WISPRepeater'],
      profile.$InterfaceStep.WiFiMode
    );
  }
  function isWiFiClient() {
    return 'Client' == profile.$InterfaceStep.WiFiMode;
  }
  function success() {
    activateClient(), activateScanList();
  }
  function pullData(rpcs, handler) {
    $scope.wifiClient.scanLoading = !0;
    var deferred = $q.defer();
    return (
      devinfo.once(rpcs.join('|'), { timeout: 2e4 }).then(function(response) {
        handler(response),
          ($scope.wifiClient.scanLoading = !1),
          deferred.resolve(response);
      }),
      deferred.promise
    );
  }
  function pullAll() {
    return pullData(_.union(getScanRpc(), [rpc.CONFIG_ID_WIFI]), pullAllCb);
  }
  function getScanRpc() {
    var scanRpc = [rpc.CONFIG_ID_WIFI_SCAN];
    return (
      $rootScope.rootIsSupport5G && scanRpc.push(rpc.CONFIG_ID_WIFI_SCAN_5G),
      scanRpc
    );
  }
  function pullScan() {
    return pullData(getScanRpc(), pullScanCb);
  }
  function pullAllCb(response) {
    var model = wifiConverter(response);
    console.log(model),
      ($scope.wifiClient.endpoint = model.Radio[1].EndPoint[1]),
      (profile.$WifiClientStep = _.extend(
        {},
        $scope.wifiClient.endpoint,
        profile.$WifiClientStep
      )),
      (profile.$WifiClientStep.Enable = !0),
      pullScanCb(response);
  }
  function pullScanCb(response) {
    var scanList = wifiConverter(response).ScanList;
    $scope.wifiClient.scanList = _.values(scanList);
  }
  function pullError() {}
  function activateClient() {
    ($scope.wifiClient.sortDirection = 'desc'),
      ($scope.wifiClient.sortActive = 'SignalStrength');
  }
  function activateScanList() {
    $scope.wifiClient.sortBy($scope.wifiClient.sortActive);
  }
  function updateScanList() {
    pullScan()
      .then(activateScanList)
      ['catch'](pullError);
  }
  function sortBy(field) {
    function sortByFieldDesc(field) {
      return function(x, y) {
        return 'Channel' == field || 'SignalStrength' == field
          ? parseInt(x[field]) < parseInt(y[field])
            ? 1
            : -1
          : x[field].toLowerCase() < y[field].toLowerCase()
            ? 1
            : -1;
      };
    }
    $scope.wifiClient.scanList.sort(
      'asc' == $scope.wifiClient.sortDirection
        ? sortByFieldAsc(field)
        : sortByFieldDesc(field)
    );
  }
  function getRepeaterPrefix(is5G) {
    return is5G ? '_5G_EXT' : '_EXT';
  }
  function selectEndpoint(index, event) {
    var data = $scope.wifiClient.scanList[index],
      ep = {
        SSID: data.SSID,
        BSSID: data.BSSID,
        Band: data.Band,
        Channel: data.Channel,
        AdvancedChannel: data.AdvancedChannel,
        Security: {
          ModeEnabled: 'WEP' == data.ModeEnabled ? 'WEP-64' : data.ModeEnabled,
          EncryptionType: data.EncryptionType,
          PreSharedKey: '',
          WEPKey1: '',
          WEPKey2: '',
          WEPKey3: '',
          WEPKey4: '',
          OpenWEP: data.OpenWEP || !1,
          OpenWEPType: 'WEP-64',
          DefaultKeyID: helper.getDefaultKeysID()[0],
          WEPasHEX: !1,
        },
      };
    _.extend(profile.$WifiClientStep, ep),
      ($scope.wifiClient.selectedEndpoint = data);
  }
  function supportedModes() {
    function getTempModes() {
      return [
        { name: 'Open', value: 'None' },
        { name: 'WEP-64', value: 'WEP-64' },
        { name: 'WEP-128', value: 'WEP-128' },
        { name: 'WPA-PSK', value: 'WPA-Personal' },
        { name: 'WPA2-PSK', value: 'WPA2-Personal' },
        { name: 'WPA-PSK/WPA2-PSK mixed', value: 'WPA-WPA2-Personal' },
      ];
    }
    if (!$scope.wifiClient.endpoint) return [];
    var modesTemplate = getTempModes(),
      modesSupported = $scope.wifiClient.endpoint.Security.ModesSupported.split(
        ','
      ),
      res = _.filter(modesTemplate, function(obj) {
        return _.indexOf(modesSupported, obj.value) >= 0;
      });
    return res;
  }
  function getDefaultKeysID() {
    return helper.getDefaultKeysID();
  }
  function getWEPTypes() {
    return helper.getWEPTypes();
  }
  function getEncrypTypes() {
    return helper.getEncrypTypes(profile.$WifiClientStep);
  }
  function showSecurity(type) {
    return helper.checkSecurityType(type, profile.$WifiClientStep);
  }
  function validPSKKey(pskKey) {
    return helper.validPSKKey(pskKey);
  }
  function getWEPKeyLenMessage() {
    return $scope.wifiClient.endpoint
      ? helper.getWEPKeyLenMessage(profile.$WifiClientStep)
      : null;
  }
  function validWEPKey(wepKey) {
    return $scope.wifiClient.endpoint
      ? helper.validWEPKey(wepKey, profile.$WifiClientStep)
      : null;
  }
  function isSelectMode() {
    return 'select' == profile.$WifiClientStep.ConnectMode;
  }
  function onConnectTypeChange() {
    profile.$WifiClientStep = {
      ConnectMode: profile.$WifiClientStep.ConnectMode,
      SeparateClient: profile.$WifiClientStep.SeparateClient,
      Band: $scope.rootIsSupport5G ? '2.4GHz' : void 0,
      Security: {
        ModeEnabled: 'None',
        EncryptionType: helper.getEncrypTypes(profile.$WifiClientStep)[0],
        PreSharedKey: '',
        WEPKey1: '',
        WEPKey2: '',
        WEPKey3: '',
        WEPKey4: '',
        OpenWEP: !1,
        OpenWEPType: 'WEP-64',
        DefaultKeyID: helper.getDefaultKeysID()[0],
        WEPasHEX: !1,
      },
    };
  }
  function ifActive(func) {
    return function() {
      return $scope.wifiClient.stepActive
        ? func.apply(null, arguments)
        : void 0;
    };
  }
  function getSelectedClass(item) {
    return profile.$WifiClientStep &&
      profile.$WifiClientStep.BSSID &&
      profile.$WifiClientStep.BSSID.toUpperCase() == item.BSSID.toUpperCase() &&
      profile.$WifiClientStep.Band == item.Band
      ? 'selected-main'
      : '';
  }
  function getAvailBands() {
    return [
      { name: '24ghz', value: '2.4GHz' },
      { name: '5ghz', value: '5GHz' },
    ];
  }
  function supportedMacAddressClone() {
    return isWiFiClient() && _.has(profile.$WifiClientStep, 'MacAddressClone');
  }
  var profile = manualProfile.profile(),
    helper = funcs.wifiHelper,
    wifiConverter = device.profile.wifi.convertSomovdToNativeFull,
    rpc = {
      CONFIG_ID_WIFI_SCAN: '133',
      CONFIG_ID_WIFI_SCAN_5G: '185',
      CONFIG_ID_WIFI: '35',
    };
  ($scope.wifiClient = {
    profile: profile,
    stepActive: !1,
    scanList: [],
    getAvailBands: getAvailBands,
    sortBy: ifActive(sortBy),
    getSelectedClass: ifActive(getSelectedClass),
    updateScanList: ifActive(updateScanList),
    supportedModes: ifActive(supportedModes),
    selectEndpoint: ifActive(selectEndpoint),
    getDefaultKeysID: ifActive(getDefaultKeysID),
    getWEPTypes: ifActive(getWEPTypes),
    getEncrypTypes: ifActive(getEncrypTypes),
    showSecurity: ifActive(showSecurity),
    validPSKKey: ifActive(validPSKKey),
    validWEPKey: ifActive(validWEPKey),
    getWEPKeyLenMessage: ifActive(getWEPKeyLenMessage),
    isSelectMode: ifActive(isSelectMode),
    onConnectTypeChange: ifActive(onConnectTypeChange),
    supportedMacAddressClone: ifActive(supportedMacAddressClone),
  }),
    manualStepApiDispatcher.get().registerStepApi({
      name: 'WiFiClientStep',
      onActivate: activate,
      onLeave: deactivate,
    });
}
angular
  .module('wizard')
  .controller('WiFiClientStepController', WiFiClientStepController),
  (WiFiClientStepController.$inject = [
    '$scope',
    '$rootScope',
    'manualProfile',
    'manualStepApiDispatcher',
    'devinfo',
    '$q',
    'funcs',
    'device',
  ]);
