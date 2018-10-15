'use strict';
!(function() {
  function DosSettingsCtrl($scope, $state, device, funcs) {
    function activate() {
      function success() {
        (dosSettings.data = util.getData().dos_filter),
          (dosSettings.blocked = util.getData().blocked),
          console.log('dosSettings.data', dosSettings.data),
          (__backupData = angular.copy(dosSettings.data)),
          (dosSettings.isActivate = !0),
          console.log('dosSettings', dosSettings),
          $scope.$emit('pageload');
      }
      util.pull().then(success, errorPull);
    }
    function getMiniTableCaption(item) {
      return item.src + ' - ' + item.dst;
    }
    function isChange() {
      return (
        dosSettings.isActivate &&
        __backupData &&
        !_.isEqual(__backupData, dosSettings.data)
      );
    }
    function apply() {
      $scope.form.$valid &&
        util.apply(dosSettings.data).then(activate, errorPush);
    }
    function errorPull() {
      $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
    }
    function errorPush() {
      $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
    }
    $scope.dosSettings = {
      data: null,
      blocked: null,
      getMiniTableCaption: getMiniTableCaption,
      isActivate: !1,
      isChange: isChange,
      apply: apply,
    };
    var dosSettings = $scope.dosSettings,
      util = device.dosSettings,
      __backupData = null;
    activate();
  }
  angular
    .module('app')
    .controllerProvider.register('DosSettingsCtrl', [
      '$scope',
      '$state',
      'device',
      'funcs',
      DosSettingsCtrl,
    ]);
})();
