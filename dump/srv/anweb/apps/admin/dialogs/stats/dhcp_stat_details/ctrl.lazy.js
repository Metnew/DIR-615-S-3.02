'use strict';
angular
  .module('app')
  .controllerProvider.register('dhcpStatDetailsCtrl', function($scope) {
    ($scope.getHeader = function() {
      return $scope.ngDialogData.header;
    }),
      ($scope.model = $scope.ngDialogData.model);
  });
