'use strict';
angular
  .module('app')
  .controllerProvider.register('CheckDeviceModeChangeDialogCtrl', [
    '$scope',
    function($scope) {
      $scope['continue'] = function() {
        return (window.location.href = '/');
      };
    },
  ]);
