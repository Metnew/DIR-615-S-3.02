'use strict';
!(function() {
  function UDPXYCtrl($scope, $state, $location, translate, funcs, util) {
    function activate() {
      function success() {
        (helper = util.makeHelper()),
          (udpxy.data = helper.getData()),
          (udpxy.port = angular.copy(udpxy.data.Port)),
          (__backupData = angular.copy(udpxy.data)),
          (udpxy.isActivate = !0);
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
    function getLinkNote() {
      var link = 'http://' + $location.host() + ':' + udpxy.port + '/status';
      return (
        translate('udpxyLink') +
        ' <a href=' +
        link +
        " target='_blank'>" +
        translate('udpxyStatus') +
        '</a>'
      );
    }
    function apply() {
      function success() {
        activate();
      }
      function error(response) {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      if (!$scope.form.$invalid) {
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start();
        util
          .apply(udpxy.data)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
    }
    function wasModified() {
      return __backupData && !_.isEqual(__backupData, udpxy.data);
    }
    function getIface(ifaceIdentifer) {
      return [{ name: translate('notSelected'), value: '' }].concat(
        helper.getIfaces(ifaceIdentifer)
      );
    }
    $scope.udpxy = {
      isActivate: !1,
      data: null,
      port: null,
      getLinkNote: getLinkNote,
      apply: apply,
      wasModified: wasModified,
      needIfaces: util.needIfaces,
      getIface: getIface,
    };
    var helper,
      udpxy = $scope.udpxy,
      __backupData = null;
    activate();
  }
  angular
    .module('app')
    .controllerProvider.register('UDPXYCtrl', [
      '$scope',
      '$state',
      '$location',
      'translate',
      'funcs',
      'udpxyUtil',
      UDPXYCtrl,
    ]);
})();
