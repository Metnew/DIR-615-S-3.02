'use strict';
function WifiMacEditNetworkDialogCtrl($scope, snackbars) {
  {
    var inx = $scope.ngDialogData.inx,
      band = $scope.ngDialogData.band,
      network = ($scope.network = angular.copy(
        $scope.networks[band].List[inx]
      ));
    $scope.device.wifiMacFilter;
  }
  ($scope.header = 'wifi_mac_network_edit'),
    ($scope.save = function() {
      $scope.wifi_mac_network_form.$valid &&
        (network.Enable || (network.AccessPolicy = 'off'),
        ($scope.networks[band].List[inx] = network),
        $scope.update($scope.closeThisDialog.bind(null, 'saved')));
    }),
    $scope.$watch('network.Enable', function(enabled) {
      enabled &&
        'off' === network.AccessPolicy &&
        (network.AccessPolicy = 'allow');
    });
}
