'use strict';
!(function() {
  angular.module('app').constant('macfilterConstants', {
    BCM:
      'undefined' == typeof RALINK_MODEM &&
      'undefined' != typeof BRCM_CMS_BUILD,
    CONFIG_ID_WAN_TEMP: 1,
    CONFIG_ID_MAC_FILTER: 74,
    RPC_NEED_REBOOT: 12,
    RPC_NEED_SAVE: 13,
    RPC_OK: 20,
  });
})();
