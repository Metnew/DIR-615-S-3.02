'use strict';
angular.module('trouble').controller('errorCableCtrl', [
  '$scope',
  function($scope) {
    console.log('DSLMode:', $scope.DSLMode),
      $scope.DSLMode
        ? (($scope.title = 'wizard_trouble_cablerr_title_dsl'),
          ($scope.message = 'wizard_trouble_cablerr_gen_dsl'))
        : (($scope.title = 'wizard_trouble_cablerr_title'),
          ($scope.message = 'wizard_trouble_cablerr_gen'));
  },
]);
