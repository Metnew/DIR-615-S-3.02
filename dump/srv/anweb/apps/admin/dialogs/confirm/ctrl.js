'use strict';
function ConfirmDialogCtrl($scope) {
  ($scope.cancel = function() {
    $scope.closeThisDialog(!1);
  }),
    ($scope.confirm = function() {
      $scope.closeThisDialog(!0);
    });
}
ConfirmDialogCtrl.$inject = ['$scope'];
