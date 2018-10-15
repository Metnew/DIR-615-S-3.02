'use strict';
angular.module('app').controller('wanEditCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q',
  '$timeout',
  'translate',
  'pageList',
  'history',
  'wanHelper',
  function(
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $q,
    $timeout,
    translate,
    pageList,
    history,
    wanHelper
  ) {
    $script(pageList.wanEdit.lazyDeps, function() {
      ($scope.__args = {
        $rootScope: $rootScope,
        $state: $state,
        $stateParams: $stateParams,
        $q: $q,
        $timeout: $timeout,
        translate: translate,
        history: history,
        wanHelper: wanHelper,
      }),
        window.wanEditCtrl
          ? $scope.$apply(wanEditCtrl)
          : $state.go('error', {
              code: 'lazyLoadError',
              message: 'lazyLoadErrorDesc',
            });
    });
  },
]);
