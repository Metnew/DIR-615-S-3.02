'use strict';
angular
  .module('app')
  .controllerProvider.register('ModalInfoCtrl', function($scope) {
    ($scope.header = $scope.ngDialogData.header),
      ($scope.content = $scope.ngDialogData.content);
  });
