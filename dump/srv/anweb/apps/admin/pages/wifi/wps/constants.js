'use strict';
!(function() {
  angular.module('app').constant('wifiWPSConstants', {
    USE_PIN_METHOD: 'undefined' == typeof SUPPORT_WPS_NO_PINwarning,
    CHECK_CONNECTION_STATUS: 'undefined' != typeof BCM47XX,
    REFRESH_ACTION: 'undefined' == typeof BRCM_CMS_BUILD,
    RESET_ACTION: 'undefined' == typeof BRCM_CMS_BUILD,
  });
})();
