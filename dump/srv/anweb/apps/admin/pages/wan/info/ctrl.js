'use strict';
angular.module('app').controller('WanInfoCtrl', [
  '$scope',
  '$state',
  '$q',
  '$timeout',
  'devinfo',
  'translate',
  'pageList',
  'wanHelper',
  function(
    $scope,
    $state,
    $q,
    $timeout,
    devinfo,
    translate,
    pageList,
    wanHelper
  ) {
    $script(pageList.wanInfo.lazyDeps, function() {
      ($scope.__args = {
        $state: $state,
        $q: $q,
        $timeout: $timeout,
        devinfo: devinfo,
        translate: translate,
        wanHelper: wanHelper,
      }),
        window.WanInfoCtrl
          ? $scope.$apply(WanInfoCtrl)
          : $state.go('error', {
              code: 'lazyLoadError',
              message: 'lazyLoadErrorDesc',
            });
    });
  },
]);
