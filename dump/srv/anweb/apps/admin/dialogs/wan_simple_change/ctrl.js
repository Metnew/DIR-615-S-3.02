'use strict';
function WanSimpleChangeCtrl($scope) {
  $scope.choise = function(value) {
    $scope.closeThisDialog(value);
  };
}
