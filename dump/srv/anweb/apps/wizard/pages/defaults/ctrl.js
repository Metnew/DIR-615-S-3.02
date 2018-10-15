'use strict';
angular.module('wizard').controller('wizardDefaultsCtrl', [
  '$scope',
  '$rootScope',
  'stepManager',
  'device',
  'profiles',
  'devinfo',
  'manualBuilder',
  '$http',
  '$timeout',
  'translate',
  'deviceAvailable',
  function(
    $scope,
    $rootScope,
    stepManager,
    device,
    profiles,
    devinfo,
    manualBuilder,
    $http,
    $timeout,
    translate,
    deviceAvailable
  ) {
    function getMode(mode) {
      var modes = {
        OPEN: 'None',
        'WEP-64': 'WEP-64',
        'WEP-128': 'WEP-128',
        WPAPSK: 'WPA-Personal',
        WPA2PSK: 'WPA2-Personal',
        WPAPSKWPA2PSK: 'WPA-WPA2-Personal',
        WPA: 'WPA-Enterprise',
        WPA2: 'WPA2-Enterprise',
        WPA1WPA2: 'WPA-WPA2-Enterprise',
      };
      return modes[mode];
    }
    var SUPPORT_WIFI_5GHZ = 'undefined' != typeof BR2_SUPPORT_WIFI_5GHZ;
    ($scope.needChangePSK =
      'undefined' != typeof BR2_PACKAGE_ANWEB_CUSTOM_PLANETA_21337),
      ($scope.customPrevStep = function() {
        stepManager.action('prev');
      }),
      ($scope.getSSSIDName = function(band) {
        var key = translate('wizard_wifi_name');
        return '2.4' == band
          ? key + String(SUPPORT_WIFI_5GHZ ? ' 2.4GHz (SSID)' : ' (SSID)')
          : key + ' 5GHz (SSID)';
      }),
      ($scope.getPSKName = function(band) {
        var key = translate('wizard_password');
        return '2.4' == band
          ? key + String(SUPPORT_WIFI_5GHZ ? ' 2.4GHz (PSK)' : ' (PSK)')
          : key + ' 5GHz (PSK)';
      }),
      ($scope.validateSSID = function(origin, value) {
        var reCyrill = /[А-яЁё]+/g;
        return reCyrill.test(value)
          ? 'defssidNotCyrillicError'
          : value && value.length
            ? value == origin
              ? 'changePassSsidDefError'
              : null
            : 'input_is_empty';
      }),
      ($scope.validatePSK = function(value) {
        if (value) {
          if (!(value.length >= 8 && value.length <= 63))
            return 'invalid_password_length';
          if (/[а-яА-Я]+/.test(value)) return 'wizard_wifi_cyrillic';
          if (!/^[\x20-\x7E]+$/g.test(value))
            return 'password_contains_illegal';
        }
        return null;
      }),
      ($scope.validatePassword = function(value) {
        var reCyrill = /[А-яЁё]+/g;
        return reCyrill.test(value)
          ? 'password_contains_cirill'
          : value.length > 31
            ? 'invalid_password_length'
            : 'undefined' == typeof BR2_ALLOW_SET_ADMINISTRATOR_PASSWORD &&
              'admin' == value
              ? 'changePassDefError'
              : value && !/^[\x20-\x7E]+$/g.test(value)
                ? 'password_contains_illegal'
                : null;
      }),
      ($scope.profile = {
        $WiFiStep: {},
        $PasswordStep: { Login: 'admin', Password: '' },
        $SystemLanguage: { Language: translate.getLang() },
      }),
      ($scope.apply = function() {
        $timeout(function() {
          if (($scope.$emit('goToErrorForm', !0), $scope.form.$valid)) {
            $rootScope.showOverlay(!0),
              $rootScope.showAvailOverlay(!1),
              console.log('manualModel', $scope.profile);
            var nativeModel = manualBuilder.build($scope.profile);
            console.log('nativeModel', nativeModel);
            var somovdModel = device.profile.nativeToSomovd(nativeModel);
            console.log('somovdModel', somovdModel),
              (somovdModel.DisableFork = !0),
              devinfo.suspend(),
              devinfo.skipAuth.suspend(),
              deviceAvailable.stop(),
              $http
                .post('/dcc_apply', somovdModel, { timeout: 6e4 })
                .then(function() {
                  console.log('profile:', $scope.profile),
                    $rootScope.setAutoAuth(
                      $scope.profile.$PasswordStep.Login,
                      $scope.profile.$PasswordStep.Password
                    ),
                    devinfo.once('notice').then(function() {
                      $rootScope.showAvailOverlay(!0),
                        $rootScope.exitFromWizard(!1, !0);
                    });
                });
          }
        });
      }),
      devinfo.once('version|wifi_general|notice').then(function(data) {
        var macPrefix = '-' + data.deviceMac.replace(/:/g, '').slice(-4);
        data.needChangeSSID24 &&
          data.wifi_general.f24.exists &&
          ($scope.profile.$WiFiStep[2.4] = {
            SSID: data.wifi_general.f24.ssid + macPrefix,
            OriginSSID: data.wifi_general.f24.ssid,
            PSK: data.wifi_general.f24.WPAPSK,
            WithoutPass: 'OPEN' == data.wifi_general.f24.authMode,
            DefaultSecurityMode: getMode(data.wifi_general.f24.authMode),
          }),
          data.needChangeSSID5 &&
            data.wifi_general.f5.exists &&
            ($scope.profile.$WiFiStep[5] = {
              SSID: data.wifi_general.f5.ssid + macPrefix,
              OriginSSID: data.wifi_general.f5.ssid,
              PSK: data.wifi_general.f5.WPAPSK,
              WithoutPass: 'OPEN' == data.wifi_general.f5.authMode,
              DefaultSecurityMode: getMode(data.wifi_general.f5.authMode),
            }),
          ($scope.needChangePass = 'NeedChangePass' == data.systemNotice);
      });
  },
]);
