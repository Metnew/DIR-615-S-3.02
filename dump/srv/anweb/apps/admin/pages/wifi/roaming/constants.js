'use strict';
!(function() {
  angular.module('app').constant('wifiRoamingConstants', {
    SUPPORT_5G: 'undefined' != typeof BR2_PACKAGE_ANWEB_WIFI_5GHZ,
  });
})();
