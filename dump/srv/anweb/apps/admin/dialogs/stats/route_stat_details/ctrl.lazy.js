'use strict';
angular
  .module('app')
  .controllerProvider.register('routeStatDetailsCtrl', function(
    $scope,
    StatsRoutingUtil
  ) {
    var util = StatsRoutingUtil;
    ($scope.needTable = util.needTable()),
      ($scope.getHeader = function() {
        return $scope.ngDialogData.header;
      }),
      ($scope.model = $scope.ngDialogData.model);
  });
