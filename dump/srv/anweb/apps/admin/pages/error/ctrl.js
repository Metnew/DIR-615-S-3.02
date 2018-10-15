'use strict';
angular.module('app').controller('ErrorCtrl', [
  '$scope',
  '$stateParams',
  'translate',
  function($scope, $stateParams, translate) {
    console.log('Error!'),
      $scope.$emit('pageload'),
      ($scope.code = $stateParams.code),
      ($scope.message = $stateParams.message);
  },
]);
