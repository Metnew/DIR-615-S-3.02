'use strict';
!(function() {
  function wifiAdvCtrl($scope, $state, translate, constants) {
    function activate() {
      device.wifi.pullAdv(function() {
        device.wifi.hasBand('2.4GHz') && $scope.wifi.band.list.push('2.4GHz'),
          device.wifi.hasBand('5GHz') && $scope.wifi.band.list.push('5GHz');
        var freq = $state.params.freq
          ? $state.params.freq
          : _.first($scope.wifi.band.list);
        $scope.wifi.band.change(freq),
          ($scope.wifi.constants = constants()),
          ($scope.wifi.isActivate = !0),
          $scope.$emit('pageload');
      });
    }
    function apply() {
      if (!isFormInvalid()) {
        var overlayId = overlay.start();
        device.wifi.push(function(error) {
          overlay.stop(overlayId),
            error
              ? $state.go('error', {
                  code: 'pushError',
                  message: 'pushErrorDesc',
                })
              : $state.go($state.current, {}, { reload: !0 });
        });
      }
    }
    function wasModified() {
      return $scope.wifi.isActivate && device.wifi.isChange();
    }
    function supportedParam(param) {
      return 'TxPreamble' == param
        ? $scope.wifi.constants.TxPreamble.supported
        : device.wifi.supportedParam(param);
    }
    function getChannelBandwidthList() {
      return $scope.wifi.radio
        ? $scope.wifi.radio.SupportedChannelBandwidth.split(',')
        : [];
    }
    function getTransmitPowerList() {
      return $scope.wifi.radio
        ? $scope.wifi.radio.TransmitPowerSupported.split(',')
        : [];
    }
    function getBGProtectionList() {
      return $scope.wifi.constants.BGProtection.list;
    }
    function getTxPreambleList() {
      return $scope.wifi.constants.TxPreamble.list;
    }
    function getHTGIList() {
      return $scope.wifi.constants.HTGI.list;
    }
    function showCoexistence(bandwidth) {
      return '20/40MHz' == bandwidth || '20/40/80MHz' == bandwidth;
    }
    function changeBand(freq) {
      isFormInvalid() ||
        (($scope.wifi.band.state = freq),
        device.wifi.setBandFreq(freq),
        ($scope.wifi.radio = device.wifi.getBand(0).radio),
        $state.go('.', { freq: freq }, { notify: !1 }));
    }
    function load(freq) {
      location.href = '#/wifi/adv?freq=' + freq;
    }
    function isFormInvalid() {
      return $scope.form.$invalid;
    }
    var device = $scope.device;
    ($scope.wifi = {
      isActivate: !1,
      radio: null,
      apply: apply,
      wasModified: wasModified,
      supportedParam: supportedParam,
      getChannelBandwidthList: getChannelBandwidthList,
      getTransmitPowerList: getTransmitPowerList,
      getBGProtectionList: getBGProtectionList,
      getTxPreambleList: getTxPreambleList,
      getHTGIList: getHTGIList,
      showCoexistence: showCoexistence,
    }),
      ($scope.wifi.band = {
        list: [],
        state: null,
        change: changeBand,
        load: load,
      });
    var overlay = $scope.overlay.circular;
    activate();
  }
  angular
    .module('app')
    .controllerProvider.register('wifiAdvCtrl', [
      '$scope',
      '$state',
      'translate',
      'wifiAdvancedConstants',
      wifiAdvCtrl,
    ]);
})();
