'use strict';
!(function() {
  function wifiAdvancedConstants() {
    function constants() {
      return {
        BGProtection: { list: makeBGProtectionList() },
        TxPreamble: { supported: !1, list: makeTxPreambleList() },
        HTGI: { list: makeHTGIList() },
        BeaconPeriod: { min: 20, max: 1024 },
        RTSThreshold: { min: 0, max: 2347 },
        FragmentationThreshold: { min: 0, max: 2346 },
        DTIMPeriod: { min: 1, max: 255 },
        StationKeepAlive: { min: 0, max: 65535 },
      };
    }
    function makeBGProtectionList(bgList) {
      return [
        { name: 'Auto', value: 'Auto' },
        { name: 'Always On', value: 'Always On' },
        { name: 'Always Off', value: 'Always Off' },
      ];
    }
    function makeTxPreambleList(txpList) {
      return [
        { name: 'wifiTransmitPreambleLong', value: 'long' },
        { name: 'wifiTransmitPreambleShort', value: 'short' },
      ];
    }
    function makeHTGIList(htgiList) {
      var result = [
        { name: 'wifiHTGIEnable', value: 'Enable' },
        { name: 'wifiHTGIDisable', value: 'Disable' },
      ];
      return (
        params.USE_HTGI_AUTO &&
          result.push({ name: 'wifiHTGIAuto', value: 'Auto' }),
        result
      );
    }
    var params = {
      USE_HTGI_AUTO:
        'undefined' != typeof BCM47XX && 'undefined' != typeof BRCM_CMS_BUILD,
    };
    return constants;
  }
  angular
    .module('app')
    .service('wifiAdvancedConstants', [wifiAdvancedConstants]);
})();
