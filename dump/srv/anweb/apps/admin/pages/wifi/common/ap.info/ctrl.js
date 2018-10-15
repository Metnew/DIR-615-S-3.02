'use strict';
!(function() {
  function WifiCommonAPInfo($scope, $state, translate) {
    function changeBand() {
      return device.wifi.getBandFreq();
    }
    function updateData(newBand, oldBand) {
      if (
        newBand &&
        (!$scope.wifi.APInfo.radio || !_.isEqual(newBand, oldBand))
      ) {
        var band = device.wifi.getBand(0);
        ($scope.wifi.APInfo.radio = band.radio),
          ($scope.wifi.APInfo.ap = band.ap);
      }
    }
    function list() {
      return $scope.wifi.APInfo.ap.list();
    }
    function add() {
      $state.go(currentState + '.ap.add', { freq: device.wifi.getBandFreq() });
    }
    function edit(item, key) {
      $state.go(currentState + '.ap.edit', {
        freq: device.wifi.getBandFreq(),
        inx: key,
      });
    }
    function remove(items, keys) {
      function hasBaseAP(keys) {
        return ~keys.indexOf('1');
      }
      function removeAP(key) {
        ap.cut(key);
      }
      if (hasBaseAP(keys))
        return void alert(translate('wifi_cant_remove_base_ap'));
      var ap = $scope.wifi.APInfo.ap;
      keys.forEach(removeAP);
    }
    function getBSSID(ap) {
      return ap.BSSID || '-';
    }
    function getModeName(mode) {
      return helper.getModeName(
        mode,
        $scope.wifi.APInfo.radio.OperatingStandards
      );
    }
    function isShowAP(inx) {
      return !/\-$/.test(inx);
    }
    function isAddDisabled() {
      if (!$scope.wifi.APInfo.radio) return !1;
      var maxAPCount = $scope.wifi.APInfo.radio.AccessPointMax,
        currectAPCount = $scope.wifi.APInfo.radio.AccessPointNumberOfEntries;
      return currectAPCount >= maxAPCount;
    }
    function existDeletedAP() {
      function isDeleted(key) {
        return /\-$/.test(key);
      }
      return Object.keys(list()).some(isDeleted);
    }
    function isOpen(ap) {
      var apInfo = $scope.wifi.APInfo,
        security = apInfo.getModeName(ap.Security.ModeEnabled);
      return 'Open' == security;
    }
    function getImgLock(ap) {
      return isOpen(ap)
        ? ''
        : '<img name="lock_img" src="/general/img/icon-lock.png">';
    }
    var device = $scope.device,
      helper = device.wifi.helper;
    ($scope.wifi.APInfo = {
      radio: null,
      ap: null,
      list: list,
      add: add,
      edit: edit,
      remove: remove,
      getBSSID: getBSSID,
      getModeName: getModeName,
      isShowAP: isShowAP,
      isAddDisabled: isAddDisabled,
      existDeletedAP: existDeletedAP,
    }),
      $scope.$watch(changeBand, updateData),
      ($scope.getCaption = function(ap) {
        return '<span class="mr-5">' + ap.SSID + '</span>' + getImgLock(ap);
      }),
      ($scope.isOpen = isOpen);
    var currentState = $state.current.name.split('.');
    currentState.pop(),
      (currentState = currentState.join('.')),
      ($scope.getShort = function(ap) {
        return $scope.wifi.APInfo.getBSSID(ap);
      });
  }
  angular
    .module('app')
    .controller('WifiCommonAPInfo', [
      '$scope',
      '$state',
      'translate',
      WifiCommonAPInfo,
    ]);
})();
