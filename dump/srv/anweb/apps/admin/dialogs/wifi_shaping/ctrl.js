'use strict';
angular.module('app').controller('WifiShapingDialogCtrl', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    ($scope.unescape = _.unescape),
      ($scope.action = $scope.ngDialogData.action),
      ($scope.rule = $scope.ngDialogData.rule),
      ($scope.rule.UploadUnlim = 0 === $scope.rule.UploadRate),
      ($scope.rule.DownloadUnlim = 0 === $scope.rule.DownloadRate),
      'edit' == $scope.action &&
        (($scope.rule.UploadRate = $scope.rule.UploadRate
          ? $scope.rule.UploadRate / $scope.constants.KbInMB
          : null),
        ($scope.rule.DownloadRate = $scope.rule.DownloadRate
          ? $scope.rule.DownloadRate / $scope.constants.KbInMB
          : null)),
      ($scope.uniqueMacValidator = function(mac) {
        return 'add' == $scope.action && $scope.wifiShaping.data[mac]
          ? 'wifiClientShapingExistMac'
          : null;
      }),
      ($scope.save = function() {
        $timeout(function() {
          $scope.$emit('goToErrorForm', !0),
            $scope.wifi_shaping_form.$valid &&
              $scope.closeThisDialog($scope.ngDialogData.rule);
        });
      });
  },
]);
