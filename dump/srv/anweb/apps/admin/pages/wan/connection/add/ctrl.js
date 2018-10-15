'use strict';
angular.module('app').controller('WanAddCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  '$timeout',
  '$q',
  'ngDialog',
  'translate',
  'pageList',
  'wanHelper',
  function(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $q,
    ngDialog,
    translate,
    pageList,
    wanHelper
  ) {
    $script(pageList.wanAdd.lazyDeps, function() {
      $scope.__args = {
        $state: $state,
        $stateParams: $stateParams,
        $q: $q,
        $timeout: $timeout,
        ngDialog: ngDialog,
        translate: translate,
        wanHelper: wanHelper,
      };
      try {
        $scope.$apply(WanAddCtrl);
      } catch (e) {
        $state.go('error', {
          code: 'lazyLoadError',
          message: 'lazyLoadErrorDesc',
        });
      }
    });
  },
]);
