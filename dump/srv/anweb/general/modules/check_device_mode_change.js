'use strict';
angular.module(regdep('modewatch'), []).service('checkDeviceModeChange', [
  'devinfo',
  '$rootScope',
  function(devinfo, $rootScope) {
    function handler(res) {
      res &&
        res.deviceMode &&
        ((currentMode = res.deviceMode),
        (initedMode = initedMode || currentMode),
        initedMode === currentMode ||
          isModeChanged ||
          ((isModeChanged = !0), $rootScope.$emit('deviceModeChanged')),
        initedMode === currentMode &&
          isModeChanged &&
          ((isModeChanged = !1), $rootScope.$emit('deviceModeRestored')));
    }
    var currentMode,
      areas = 'notice',
      initedMode = null,
      isModeChanged = !1;
    (this.start = function() {
      return devinfo.skipAuth.subscribe(areas, handler);
    }),
      (this.stop = function() {
        return devinfo.skipAuth.unsubscribe(areas, handler);
      });
  },
]);
