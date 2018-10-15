'use strict';
function WiFi24StepController(
  $scope,
  $rootScope,
  manualProfile,
  apiDispatcher
) {
  WiFiStepController($scope, $rootScope, manualProfile, apiDispatcher, '2.4');
}
function WiFiStep5Controller($scope, $rootScope, manualProfile, apiDispatcher) {
  WiFiStepController($scope, $rootScope, manualProfile, apiDispatcher, '5');
}
function WiFiStepController(
  $scope,
  $rootScope,
  manualProfile,
  apiDispatcher,
  freq
) {
  function checkWIFISSID(value) {
    return value == profile.$WiFiStep[freq].defaultSSID
      ? 'wizard_default_ssid'
      : null;
  }
  function onWifiEnableChange() {
    profile.$WiFiStep[freq] &&
      profile.$WiFiStep[freq].Enable === !1 &&
      (profile.$WiFiStep[freq].GuestAP = !1);
  }
  function checkPSK(value) {
    if (value) {
      if (!(value.length >= 8 && value.length <= 63))
        return 'invalid_password_length';
      if (/[а-яА-Я]+/.test(value)) return 'wizard_wifi_cyrillic';
      if (!/^[\x20-\x7E]+$/g.test(value)) return 'password_contains_illegal';
    }
    return null;
  }
  function supportedParam(paramName) {
    return !_.isUndefined(profile.$WiFiStep[freq][paramName]);
  }
  function onBandwidthRestrictedEnableChange() {
    profile.$WiFiStep[freq].GuestBandwidthRestricted.enable
      ? (profile.$WiFiStep[
          freq
        ].GuestBandwidthRestricted.value = bandwithBackup)
      : ((bandwithBackup = angular.copy(
          profile.$WiFiStep[freq].GuestBandwidthRestricted.value
        )),
        (profile.$WiFiStep[freq].GuestBandwidthRestricted.value = 0));
  }
  function onActivate() {
    'ap' == profile.$DeviceMode.Mode && (profile.$WiFiStep[freq].GuestAP = !1);
  }
  function onWifiNetworkNameChange() {
    isGuestSSIDChanged ||
      (profile.$WiFiStep[freq].GuestSSID =
        profile.$WiFiStep[freq].SSID + '_Guest');
  }
  function onWifiGestSSIDChange() {
    isGuestSSIDChanged = !0;
  }
  var profile = manualProfile.profile(),
    isGuestSSIDChanged = !1,
    bandwithBackup = 0;
  ($scope.wifiStep = {
    profile: profile,
    onWifiEnableChange: onWifiEnableChange,
    onActivate: onActivate,
    checkWIFISSID: checkWIFISSID,
    checkPSK: checkPSK,
    supportedParam: supportedParam,
    onWifiNetworkNameChange: onWifiNetworkNameChange,
    onWifiGestSSIDChange: onWifiGestSSIDChange,
  }),
    apiDispatcher.get().registerStepApi({
      name: '2.4' == freq ? 'WiFiStep' : 'WiFi5GStep',
      onActivate: onActivate,
    }),
    '5' == freq &&
      (($scope.wifiStep.onBandwidthRestrictedEnableChange = onBandwidthRestrictedEnableChange),
      ($scope.wifiStep.band = freq)),
    ($scope.freq = freq),
    console.log('Freq: ' + $scope.freq);
}
angular
  .module('wizard')
  .controller('WiFiStep24Controller', WiFi24StepController)
  .controller('WiFiStep5Controller', WiFiStep5Controller),
  (WiFi24StepController.$inject = [
    '$scope',
    '$rootScope',
    'manualProfile',
    'manualStepApiDispatcher',
  ]),
  (WiFiStep5Controller.$inject = [
    '$scope',
    '$rootScope',
    'manualProfile',
    'manualStepApiDispatcher',
  ]);
