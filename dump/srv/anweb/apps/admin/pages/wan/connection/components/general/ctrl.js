'use strict';
!(function() {
  function WanGeneralCtrl($scope, translate) {
    function ifaceDescription() {
      var result = '';
      return (result += translate($scope.wan.model['interface'].info));
    }
    function has(field) {
      switch (field) {
        case 'Name':
          return core.mode.isAdvancedMode();
      }
      return !0;
    }
    var core = $scope.wanCore;
    $scope.general = {
      action: $scope.wan.action,
      ifaceDescription: ifaceDescription,
      has: has,
    };
  }
  angular
    .module('app')
    .controller('WanGeneralCtrl', ['$scope', 'translate', WanGeneralCtrl]);
})();
