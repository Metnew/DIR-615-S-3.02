'use strict';
angular.module('wizard').controller('wizardGeoCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  'regions',
  'profiles',
  function($scope, $rs, $state, regions, profiles) {
    ($scope.found = null),
      ($scope.message = 'wizard_geo_request'),
      ($scope.query = function() {
        'geolocation' in navigator
          ? navigator.geolocation.getCurrentPosition(
              function(data) {
                var coord = [data.coords.latitude, data.coords.longitude];
                $scope.$apply(function() {
                  ($scope.found = regions.byGeo(coord)), ($scope.message = '');
                });
              },
              function(error) {
                $scope.$apply(function() {
                  switch (error.code) {
                    case error.PERMISSION_DENIED:
                      $scope.message = 'wizard_geo_deny';
                      break;
                    case error.POSITION_UNAVAILABLE:
                      $scope.message = 'wizard_geo_none';
                      break;
                    case error.TIMEOUT:
                      $scope.message = 'wizard_geo_timeout';
                      break;
                    case error.UNKNOWN_ERROR:
                      $scope.message = 'wizard_geo_unknown';
                  }
                });
              }
            )
          : $state.go('search');
      }),
      ($scope.yes = function() {
        $scope.found &&
          (($rs.foundRegion = $scope.found),
          ($rs.gTZ = regions.findTZ($scope.found.ID)),
          profiles.load($scope.found.ID, function(res) {
            $scope.searchStateLogic(res.result.data);
          }));
      }),
      ($scope.customPrevStep = function() {
        $state.go($scope.gDeviceInfo.deviceStartState ? 'trstatus' : 'lang');
      }),
      ($scope.no = function() {
        $scope.nextStep();
      }),
      ($scope.skip = function() {
        $scope.nextStep();
      }),
      regions.load(function(list) {
        $scope.query();
      });
  },
]);
