'use strict';
!(function() {
  angular.module('app').constant('rpcIpfilterConstants', {
    CONFIG_ID_WAN_TEMP: 1,
    CONFIG_ID_IPFILTER: 88,
    BRCM: 'undefined' == typeof BRCM_CMS_BUILD,
    BRIPV6: !0,
  });
})();
