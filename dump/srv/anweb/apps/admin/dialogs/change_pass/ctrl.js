'use strict';
function ChangePassDialogCtrl(
  $scope,
  nwPasswordService,
  translate,
  device,
  devinfo,
  $q
) {
  function activate() {
    function SsidConfig(band, name) {
      function apply() {
        base.SSID = config.value;
      }
      function getBandAp(band) {
        return device.wifi.getBand(0, band + 'GHz').ap;
      }
      var config = {},
        ap = getBandAp(band),
        base = ap.getBase(),
        postfix = $scope.deviceMac
          ? $scope.deviceMac.replace(/:/g, '').slice(-4)
          : device.funcs.randomString(4);
      return (
        (config.name = name),
        (config.band = band),
        (config.value = base.SSID + '-' + postfix),
        (config.defaultSSID = angular.copy(base.SSID)),
        (config.apply = apply),
        config
      );
    }
    pull().then(function() {
      var name = translate('network_name'),
        ssid24name = SUPPORT_WIFI_5GHZ
          ? name + ' 2.4GHz (SSID)'
          : name + ' (SSID)';
      $scope.needChangeSSID24 &&
        ($scope.ssids[2.4] = new SsidConfig('2.4', ssid24name)),
        $scope.needChangeSSID5 &&
          SUPPORT_WIFI_5GHZ &&
          ($scope.ssids[5] = new SsidConfig('5', name + ' 5GHz (SSID)'));
    });
  }
  function passwordChange(value) {
    $scope.passwd.errorMessage = null;
  }
  function pull() {
    function pullWifi() {
      var deferred = $q.defer();
      return (
        device.wifi.pullCommon(function(error) {
          error ? deferred.reject() : deferred.resolve();
        }),
        deferred.promise
      );
    }
    function pullDevinfo() {
      return devinfo.once('version').then(function(result) {
        $scope.deviceMac = result.deviceMac;
      });
    }
    return device.wifi.pullCommon
      ? pullWifi().then(pullDevinfo)
      : pullDevinfo();
  }
  function save() {
    function success() {
      $scope.closeThisDialog();
    }
    formValid() &&
      changePass()
        .then(saveSsid)
        .then(success);
  }
  function changePass() {
    function success() {
      deferred.resolve();
    }
    function error(msg) {
      ($scope.passwd.errorMessage = translate(msg)),
        deferred.reject($scope.passwd.errorMessage);
    }
    var deferred = $q.defer();
    if ($scope.needChangePass) {
      var login = 'admin',
        password = $scope.passwd.value;
      nwPasswordService.change(login, password).then(success, error);
    } else success();
    return deferred.promise;
  }
  function saveSsid() {
    var deferred = $q.defer();
    return (
      _.keys($scope.ssids).length
        ? (_.each(_.values($scope.ssids), function(ssidConfig) {
            ssidConfig.apply();
          }),
          device.wifi.push(function() {
            deferred.resolve();
          }, !0))
        : deferred.resolve(),
      deferred.promise
    );
  }
  function saveEnabled() {
    return formValid();
  }
  function formValid() {
    return (
      $scope.form_change_password.$valid &&
      (!$scope.needChangePass || $scope.passwd.value.length)
    );
  }
  var SUPPORT_WIFI_5GHZ = 'undefined' != typeof BR2_SUPPORT_WIFI_5GHZ,
    ALLOW_SET_ADMINISTRATOR_PASSWORD =
      'undefined' != typeof BR2_ALLOW_SET_ADMINISTRATOR_PASSWORD;
  _.extend($scope, {
    ssids: {},
    passwd: { value: '', change: passwordChange },
    ssid: {},
    needChangeSSID24: $scope.ngDialogData.needChangeSSID24,
    needChangeSSID5: $scope.ngDialogData.needChangeSSID5,
    needChangePass: $scope.ngDialogData.needChangePass,
    deviceMac: null,
    save: save,
    saveEnabled: saveEnabled,
  }),
    activate(),
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
    ($scope.validatePassword = function(value) {
      var reCyrill = /[А-яЁё]+/g;
      return reCyrill.test(value)
        ? 'password_contains_cirill'
        : value.length > 31
          ? 'invalid_password_length'
          : ALLOW_SET_ADMINISTRATOR_PASSWORD || 'admin' != value
            ? value && !/^[\x20-\x7E]+$/g.test(value)
              ? 'password_contains_illegal'
              : null
            : 'changePassDefError';
    });
}
