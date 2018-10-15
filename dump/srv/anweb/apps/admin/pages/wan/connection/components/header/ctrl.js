'use strict';
!(function() {
  function WanHeaderCtrl($scope, translate, $state, funcs) {
    function activate() {
      header.list.push({ value: 'basic', description: 'wanSettingBasic' }),
        header.list.push({ value: 'full', description: 'wanSettingFull' }),
        (header.state = header.list[0].value),
        (header.isActivate = !0),
        $scope.$emit('wan.header.state', header.state);
    }
    function changePrepare(toView, fromView) {
      function isValid() {
        return $scope.form && $scope.form.$valid;
      }
      if (
        'full' == fromView &&
        !isValid() &&
        !_.isEqual($scope.wan.model, backupModel)
      ) {
        if (!confirm(translate('wan_change_invalid_form_mode'))) return null;
        funcs.deepExtend($scope.wan.model, backupModel);
      }
      return !0;
    }
    function changeSuccess(toView, fromView) {
      (backupModel = angular.copy($scope.wan.model)),
        (header.state = toView),
        $scope.$emit('wan.header.change', header.state),
        $scope.$emit('resetErrorForm', !0);
    }
    ($scope.wanHeader = {
      list: [],
      state: null,
      activate: activate,
      changePrepare: changePrepare,
      changeSuccess: changeSuccess,
    }),
      ($scope.wanHeader.isActivate = !1);
    var header = $scope.wanHeader,
      backupModel = null;
    activate();
  }
  angular
    .module('app')
    .controller('WanHeaderCtrl', [
      '$scope',
      'translate',
      '$state',
      'funcs',
      WanHeaderCtrl,
    ]);
})();
