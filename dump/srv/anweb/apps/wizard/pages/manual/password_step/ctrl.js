'use strict';
function PasswordStepController($scope, $rootScope, manualProfile) {
  $scope.passwordStep = {
    profile: manualProfile.profile(),
    passwValidator: function(value) {
      var reCyrill = /[А-яЁё]+/g;
      return reCyrill.test(value)
        ? 'password_contains_cirill'
        : value.length > 31
          ? 'invalid_password_length'
          : 'undefined' == typeof BR2_ALLOW_SET_ADMINISTRATOR_PASSWORD &&
            'admin' == value
            ? 'changePassDefError'
            : value && !/^[\x20-\x7E]+$/g.test(value)
              ? 'password_contains_illegal'
              : null;
    },
  };
}
angular
  .module('wizard')
  .controller('PasswordStepController', PasswordStepController),
  (PasswordStepController.$inject = ['$scope', '$rootScope', 'manualProfile']);
