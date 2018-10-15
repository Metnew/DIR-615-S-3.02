'use strict';
!(function() {
  angular.module('app').constant('wifiClientConstants', {
    supportMacClone:
      'undefined' != typeof BR2_PACKAGE_ANWEB_WIFI_CLIENT_SUPPORT_MAC_CLONE,
    autoScan: !1,
  });
})();
