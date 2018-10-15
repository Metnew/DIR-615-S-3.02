'use strict';
!(function() {
  angular.module('app').constant('ipfilterConstants', {
    DENY_IP_RANGE:
      'undefined' != typeof BR2_PACKAGE_ANWEB_IP_FILTER_DENY_IP_RANGE,
  });
})();
