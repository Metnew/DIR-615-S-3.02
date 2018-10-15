'use strict';
angular
  .module('app')
  .controllerProvider.register('netStatDetailsCtrl', function($scope) {
    ($scope.getHeader = function() {
      return $scope.ngDialogData.header;
    }),
      ($scope.isEmpty = function(value) {
        return _.isEmpty(value);
      }),
      ($scope.model = $scope.ngDialogData.model);
  });
