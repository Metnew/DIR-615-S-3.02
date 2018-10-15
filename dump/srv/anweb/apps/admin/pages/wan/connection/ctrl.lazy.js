'use strict';
!(function() {
  function WanConnectionCtrl($scope, $state) {
    function identifyAction() {
      var reAdd = /add/,
        reEdit = /edit/,
        name = $state.current.name;
      return reAdd.test(name) ? 'add' : reEdit.test(name) ? 'edit' : '';
    }
    function makeBackup() {
      function clean() {
        __initial = null;
      }
      function set(obj) {
        __initial = angular.copy(obj);
      }
      function check(obj) {
        return __initial
          ? _.every(__initial, function(data, key) {
              return _.isEqual(data, obj[key]);
            })
          : !0;
      }
      var __initial = null;
      return { clean: clean, set: set, check: check };
    }
    $scope.device, $scope.device.wan;
    ($scope.wanCore.connection = {
      identifyAction: identifyAction,
      makeBackup: makeBackup,
    }),
      ($scope.wanCore.connection.isActivate = !0);
    $scope.wanCore.connection;
  }
  angular
    .module('app')
    .controllerProvider.register('WanConnectionCtrl', [
      '$scope',
      '$state',
      WanConnectionCtrl,
    ]);
})();
