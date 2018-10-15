'use strict';
!(function() {
  angular.module('app').service('wifiWMMUtil', [
    'wifiWMMConstants',
    function(consts) {
      function hasSupportMode() {
        return consts.SUPPORT_MODE;
      }
      return { hasSupportMode: hasSupportMode };
    },
  ]);
})();
