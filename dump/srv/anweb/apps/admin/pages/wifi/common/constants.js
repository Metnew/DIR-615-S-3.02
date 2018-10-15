'use strict';
!(function() {
  angular.module('app').constant('wifiCommonConstants', {
    disabledCountry:
      'undefined' != typeof BR2_PACKAGE_ANWEB_WIFI_DISABLE_COUNTRY,
  });
})();
