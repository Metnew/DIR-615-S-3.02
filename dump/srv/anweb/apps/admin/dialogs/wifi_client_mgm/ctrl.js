'use strict';
!(function() {
  angular.module('app').controller('wifiClientMgmDialogCtrl', function($scope) {
    ($scope.client = $scope.ngDialogData.rule),
      ($scope.imgSignal = $scope.ngDialogData.imgSignal),
      ($scope.ngDialogData.header =
        $scope.client.hostname && '' != $scope.client.hostname
          ? $scope.client.hostname
          : $scope.client.mac),
      ($scope.isEmpty = function(value) {
        return _.isEmpty(value);
      });
  });
})();
