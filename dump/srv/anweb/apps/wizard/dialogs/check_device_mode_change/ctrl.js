'use strict';
angular.module('wizard').controller('CheckDeviceModeChangeDialogCtrl', [
  '$scope',
  function($scope) {
    $scope['continue'] = function() {
      return goAway('/');
    };
  },
]);
