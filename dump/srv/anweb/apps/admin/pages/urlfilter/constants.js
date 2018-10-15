'use strict';
!(function() {
  angular.module('app').constant('urlfilterConstants', {
    BROADCOM: 'undefined' != typeof BCM47XX,
    RALINK_MODEM: 'undefined' != typeof RALINK_MODEM,
    BROADCOM_MODEM:
      'undefined' == typeof RALINK_MODEM &&
      'undefined' != typeof BRCM_CMS_BUILD,
    RLX_819X_DNS_FILTER: !0,
  });
})();
