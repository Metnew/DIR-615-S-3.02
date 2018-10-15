'use strict';
!(function() {
  function SysTelnetCtrl($scope, $state, util, snackbars) {
    function init() {
      function success() {
        (telnet.data = util.getData()),
          (telnet.supported = util.getSupported()),
          (__backup = angular.copy(telnet.data));
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      util
        .pull()
        .then(success)
        ['catch'](error)
        ['finally']($scope.$emit.bind($scope, 'pageload'));
    }
    function apply() {
      function success() {
        snackbars.add('apply_success'), init();
      }
      function error() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      if (!$scope.telnetSettings.$invalid) {
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start();
        util
          .apply(telnet.data)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
    }
    function wasModified() {
      return __backup && !_.isEqual(__backup, telnet.data);
    }
    $scope.telnet = {
      data: null,
      supported: null,
      apply: apply,
      wasModified: wasModified,
    };
    var telnet = $scope.telnet,
      __backup = null;
    init();
  }
  angular
    .module('app')
    .controllerProvider.register('SysTelnetCtrl', [
      '$scope',
      '$state',
      'telnetUtil',
      'snackbars',
      SysTelnetCtrl,
    ]);
})();
