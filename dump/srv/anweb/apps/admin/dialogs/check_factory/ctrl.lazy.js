'use strict';
angular.module('app').controllerProvider.register('CheckFactoryDialogCtrl', [
  '$scope',
  '$rootScope',
  'somovd',
  '$q',
  function($scope, $rootScope, somovd, $q) {
    ($scope.toWizard = function() {
      window.location.href = '/wizard/index-wizard.html';
    }),
      ($scope['continue'] = function() {
        somovd.write(67, { lang: $rootScope.lang }).then(
          somovd.save.bind(null, function() {
            return location.reload();
          })
        );
      });
  },
]);
