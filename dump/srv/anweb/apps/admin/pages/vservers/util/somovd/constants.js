'use strict';
!(function() {
  angular.module('app').constant('vserversConstants', {
    SUPPORT_VOIP: 'undefined' != typeof BR2_PACKAGE_ANWEB_SUPPORT_VOIP,
    SUPPORT_NAT_LOOPBACK: !0,
    GOODLINE: 'undefined' != typeof BR2_PACKAGE_ANWEB_CUSTOM_GOODLINE_21218,
    CONFIG_ID_WAN_TEMP: 1,
    CONFIG_ID_DSL_VSERVERS: 10,
    CONFIG_ID_HTTPACCESS: 16,
    CONFIG_ID_VOIP: 76,
    CONFIG_ID_TR69: 70,
    RPC_NEED_REBOOT: 12,
    RPC_NEED_SAVE: 13,
    RPC_OK: 20,
  });
})();
