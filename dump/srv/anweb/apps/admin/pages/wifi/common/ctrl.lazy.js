'use strict';
!(function() {
  function wifiCommonCtrl($scope, $state, translate, history, shared) {
    function activate() {
      shared.activate().then(function() {
        device.wifi.hasBand('2.4GHz') && $scope.wifi.band.list.push('2.4GHz'),
          device.wifi.hasBand('5GHz') && $scope.wifi.band.list.push('5GHz');
        var freq = $state.params.freq
          ? $state.params.freq
          : _.first($scope.wifi.band.list);
        $scope.wifi.band.change(freq),
          ($scope.wifi.isActivate = !0),
          $scope.$emit('pageload');
      });
    }
    function apply() {
      !isFormInvalid() && wasModified() && shared.apply();
    }
    function wasModified() {
      return $scope.wifi.isActivate && device.wifi.isChange();
    }
    function changeBand(freq) {
      isFormInvalid() ||
        (($scope.wifi.band.state = freq),
        device.wifi.setBandFreq(freq),
        ($scope.wifi.radio = device.wifi.getBand(0).radio),
        ($scope.wifi.ap.data = device.wifi.getBand(0).ap.get(1)),
        ($scope.wifi.advancedAp.bandwidthRestrictedEnable =
          0 != $scope.wifi.ap.data.BandwidthRestricted),
        $state.go('.', { freq: freq }, { notify: !1 }),
        addChangeToHistory(freq));
    }
    function load(freq) {
      location.href = '#/wifi/common?freq=' + freq;
    }
    function addChangeToHistory(freq) {
      var last = history.getObj(-1);
      last.params.freq !== freq &&
        history.add({
          title: last.title,
          name: last.name,
          params: { freq: freq },
        });
    }
    function isFormInvalid() {
      return $scope.form.$invalid;
    }
    {
      var device = $scope.device;
      device.wifi.helper;
    }
    ($scope.wifi = {
      isActivate: !1,
      radio: null,
      ap: { data: null },
      advancedAp: { bandwidthRestrictedEnable: !1 },
      apply: apply,
      wasModified: wasModified,
    }),
      ($scope.wifi.band = {
        list: [],
        state: null,
        change: changeBand,
        load: load,
      }),
      activate();
  }
  angular
    .module('app')
    .controllerProvider.register('wifiCommonCtrl', [
      '$scope',
      '$state',
      'translate',
      'history',
      'wifiCommonShared',
      wifiCommonCtrl,
    ]);
})();
