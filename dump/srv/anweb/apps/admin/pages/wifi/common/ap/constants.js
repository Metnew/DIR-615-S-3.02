'use strict';
!(function() {
  angular.module('app').constant('wifiAPConstants', {
    SUPPORT_GUEST_ACCESS: !0,
    SUPPORT_NSG_SERVICE: !('undefined' == typeof BR2_PACKAGE_ANWEB_NSG),
  });
})();
