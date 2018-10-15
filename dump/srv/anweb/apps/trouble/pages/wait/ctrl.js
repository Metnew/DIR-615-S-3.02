'use strict';
angular.module('trouble').controller('waitCtrl', [
  '$scope',
  function($scope) {
    ($scope.WAIT_TIMEOUT = 2e4),
      ($scope.onBarStatus = function(status) {
        'finished' == status && $scope.showNextError();
      });
  },
]);
