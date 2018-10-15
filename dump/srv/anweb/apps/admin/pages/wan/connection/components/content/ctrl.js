'use strict';
!(function() {
  function WanContentCtrl($scope, $state) {
    function getType() {
      return $state.params.type;
    }
    $scope.content = { getType: getType };
  }
  angular
    .module('app')
    .controller('WanContentCtrl', ['$scope', '$state', WanContentCtrl]);
})();
