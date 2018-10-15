'use strict';
!(function() {
  function BandwidthEditDialogController($scope) {
    ($scope.portName = $scope.ngDialogData.portName),
      ($scope.portBandwidth = angular.copy($scope.ngDialogData.bandwidth)),
      ($scope.bandwidthEnable = -1 != $scope.portBandwidth.egress_bandwidth);
    var egressBandwidthBackup = angular.copy(
      $scope.portBandwidth.egress_bandwidth
    );
    ($scope.toggleBandwidth = function() {
      $scope.bandwidthEnable
        ? ($scope.portBandwidth.egress_bandwidth =
            -1 == egressBandwidthBackup
              ? $scope.portBandwidth.max_bandwidth
              : egressBandwidthBackup)
        : ((egressBandwidthBackup = angular.copy(
            $scope.portBandwidth.egress_bandwidth
          )),
          ($scope.portBandwidth.egress_bandwidth = -1));
    }),
      ($scope.saveRule = function() {
        $scope.bandwidth_edit_form.$invalid ||
          $scope.closeThisDialog($scope.portBandwidth);
      });
  }
  angular
    .module('app')
    .controllerProvider.register(
      'BandwidthEditDialogController',
      BandwidthEditDialogController
    ),
    (BandwidthEditDialogController.$inject = ['$scope']);
})();
