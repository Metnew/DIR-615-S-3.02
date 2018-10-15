'use strict';
angular.module('wizard').controller('wizardProvListCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'profiles',
  '$timeout',
  function($scope, $rootScope, $state, $stateParams, profiles, $timeout) {
    $scope.providers || $state.go('search'),
      ($scope.selectProvider = function(services) {
        ($rootScope.servicelist = services),
          _.size(services) > 1
            ? $state.go('servicelist')
            : (($rootScope.selectedProfile = _.first(services)),
              $state.go('master'));
      });
  },
]);
