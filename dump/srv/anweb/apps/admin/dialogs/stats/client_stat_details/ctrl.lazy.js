'use strict';
angular
  .module('app')
  .controllerProvider.register('clientStatDetailsCtrl', function($scope) {
    ($scope.getHeader = function() {
      return $scope.ngDialogData.header;
    }),
      ($scope.model = $scope.ngDialogData.model);
  });
