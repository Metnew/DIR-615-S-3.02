'use strict';
function WifiWMMEditDialogCtrl($rootScope, $scope, $interpolate, $state) {
  var utilWMM = $scope.band.wmm;
  ($scope.type = $scope.ngDialogData.type),
    ($scope.key = $scope.ngDialogData.key);
  var point = ($scope.point = utilWMM.get($scope.type, $scope.key));
  ($scope.backupPoint = angular.copy(point)),
    ($scope.isAP = 'ap' === $scope.type),
    ($scope.shortAC = point.AccessCategory),
    ($scope.getHeader = function() {
      var header,
        type = $scope.isAP ? 'access_point' : 'station',
        accessCategory = $scope.transcripts[$scope.shortAC];
      return (
        (header =
          '{{"wifi_wmm_edit_' + type + '" | translate}}: ' + accessCategory),
        $interpolate(header)($scope)
      );
    }),
    ($scope.getCWValues = function(max) {
      for (var result = [], i = 1; max >= i; i++)
        result.push({ key: i, val: $scope.getCWValue(i) });
      return result;
    }),
    ($scope.isSavingDisabled = function() {
      return $scope.wifi_wmm_edit_form.$invalid || !$scope.wasModified();
    }),
    ($scope.save = function() {
      $scope.closeThisDialog('save');
    }),
    ($scope.restrictions = utilWMM.getRestriction($scope.type, $scope.shortAC)),
    ($scope.wasModified = function() {
      return $scope.point && !_.isEqual($scope.point, $scope.backupPoint);
    });
}
