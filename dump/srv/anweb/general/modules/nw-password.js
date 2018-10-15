'use strict';
!(function() {
  function nwPassword(translate, passwordService) {
    function link($scope, $element, $attrs) {
      ($scope.password = {
        label: '',
        value: '',
        required: !1,
        autocomplete: _.has($attrs, 'nwPasswordAutocomplete'),
        novalidation: _.has($attrs, 'nwPasswordNovalidation'),
        focus: _.has($attrs, 'nwPasswordFocus') ? 'true' : 'false',
        tabindex: _.has($attrs, 'nwPasswordTabIndex')
          ? $attrs.nwPasswordTabIndex
          : '0',
      }),
        $attrs.$observe('nwPasswordDescription', function(value) {
          $scope.password.description = value || '';
        }),
        $attrs.$observe('nwPasswordRequired', function(value) {
          $scope.password.required = value || '' === value;
        }),
        $attrs.$observe('nwPasswordLabel', function(value) {
          $scope.password.label = value || 'password';
        }),
        $scope.$watch('nwPasswordValue', function(value) {
          _.isUndefined(value) || ($scope.password.value = value);
        }),
        ($scope.passwordChange = function(value) {
          _.isFunction($scope.nwPasswordChange) &&
            $scope.nwPasswordChange({ value: value }),
            ($scope.nwPasswordValue = value);
        }),
        ($scope.passwordValidation = function(value, password, model) {
          var customValid =
            $attrs.nwPasswordValid && _.isFunction($scope.nwPasswordValid);
          return $scope.password.novalidation
            ? null
            : customValid
              ? $scope.nwPasswordValid({ value: value })
              : passwordService.validation(value, password, model);
        });
    }
    var template =
      "<div><input type='password' name='autocomplete_off_trick' style='display: none;' ng-if='!password.autocomplete' /><div nw-field nw-label='{{password.label}}' nw-required='password.required'><input type='password' tab-index='{{password.tabindex}}' ng-model='password.value' ng-change=passwordChange(password.value) nw-custom-valid='passwordValidation(value, password, password.model)' nw-eye nw-set-focus='{{password.focus}}' /></div><div class='note description' ng-if='password.description'>{{ password.description | translate }}</div></div>";
    return {
      restrict: 'A',
      replace: !0,
      template: template,
      scope: {
        nwPasswordValue: '=',
        nwPasswordValid: '&',
        nwPasswordChange: '&',
      },
      link: link,
    };
  }
  function nwPasswordConfirm(translate, passwordService) {
    function link($scope, $element, $attrs) {
      function isConfirmPassword() {
        return password.value == password.confirm.value;
      }
      function passwordValidation(value, password, model) {
        var customValid =
          $attrs.nwPasswordConfirmValid &&
          _.isFunction($scope.nwPasswordConfirmValid);
        return customValid
          ? $scope.nwPasswordConfirmValid({ value: value })
          : passwordService.validation(value, password, model);
      }
      function passwordChange(value) {
        $scope.nwPasswordConfirmValue = value;
      }
      function getModel(input) {
        return input ? angular.element(input).data('$ngModelController') : null;
      }
      $scope.password = {
        label: '',
        value: '',
        model: getModel($element.find('input')[1]),
        confirm: {
          label: '',
          value: '',
          model: getModel($element.find('input')[3]),
        },
      };
      var password = $scope.password;
      $attrs.$observe('nwPasswordDescription', function(value) {
        password.description = value || '';
      }),
        $attrs.$observe('nwPasswordConfirmLabel', function(value) {
          password.label = value || 'password';
        }),
        $attrs.$observe('nwPasswordConfirmLabel2', function(value) {
          password.confirm.label = value || 'confirmPassword';
        }),
        $scope.$watch('nwPasswordConfirmValue', function(value) {
          _.isUndefined(value) || (password.value = value);
        }),
        $scope.$watch(isConfirmPassword, function(value) {
          $scope.nwPasswordConfirmCheck({ value: value });
        }),
        $scope.$watch('nwPasswordConfirmReset', function(value) {
          value &&
            ((password.value = ''),
            (password.confirm.value = ''),
            password.model.$setPristine(),
            password.confirm.model.$setPristine(),
            ($scope.nwPasswordConfirmReset = !1));
        }),
        ($scope.passwordValidation = passwordValidation),
        ($scope.passwordChange = passwordChange);
    }
    var template =
      "<div><input type='password' name='autocomplete_off_trick' style='display: none;' /><div nw-field nw-label='{{password.label}}' nw-required><input type='password' ng-model='password.value' ng-change=passwordChange(password.value) nw-custom-valid='passwordValidation(value, password, password.model)' /></div><div class='note' ng-if='password.description'>{{ password.description | translate }}</div><input type='password' name='autocomplete_off_trick' style='display: none;' /><div nw-field nw-label='{{password.confirm.label}}' nw-required><input type='password' ng-model='password.confirm.value' nw-custom-valid='passwordValidation(value, password, password.confirm.model)' /></div></div>";
    return {
      restrict: 'A',
      replace: !0,
      template: template,
      scope: {
        nwPasswordConfirmValue: '=',
        nwPasswordConfirmCheck: '&',
        nwPasswordConfirmReset: '=',
        nwPasswordConfirmValid: '&',
      },
      link: link,
    };
  }
  function nwPasswordService(
    $q,
    somovd,
    funcs,
    authDigest,
    authDigestCredentialsStorage,
    authDigestRealmStorage
  ) {
    function change(login, password) {
      function writeCb(response) {
        if (funcs.is.allRPCSuccess(response)) {
          var credentials = { username: login, password: password },
            authHeader = authDigestCredentialsStorage.get(
              authDigestRealmStorage.getCurrent()
            );
          authDigest.setCredentials(credentials, authHeader),
            deferred.resolve('password_changed');
        } else
          deferred.reject(
            response.status == RPC_INVALID_VALUES
              ? 'password_invalid_value'
              : 'password_not_changed'
          );
      }
      var deferred = $q.defer();
      return (
        somovd.write(
          CONFIG_ID_SET_PASS,
          { login: login, pass: password },
          writeCb
        ),
        deferred.promise
      );
    }
    function validation(value, password, model) {
      var reCyrill = /[А-яЁё]+/g,
        reLegal = /^[\x20-\x7E]*$/g,
        passwordsNotEqual =
          password &&
          password.confirm &&
          '' !== password.confirm.value &&
          password.value !== password.confirm.value &&
          model.$dirty;
      return value.length > 31
        ? 'invalid_password_length'
        : reCyrill.test(value)
          ? 'password_contains_cirill'
          : reLegal.test(value)
            ? passwordsNotEqual
              ? 'passwords_not_equal'
              : null
            : 'password_contains_illegal';
    }
    var CONFIG_ID_SET_PASS = 69,
      RPC_INVALID_VALUES = 52;
    return { change: change, validation: validation };
  }
  var nw = angular.module(regdep('nw-password'), []);
  nw.directive('nwPassword', ['translate', 'nwPasswordService', nwPassword]),
    nw.directive('nwPasswordConfirm', [
      'translate',
      'nwPasswordService',
      nwPasswordConfirm,
    ]),
    nw.service('nwPasswordService', [
      '$q',
      'somovd',
      'funcs',
      'authDigest',
      'authDigestCredentialsStorage',
      'authDigestRealmStorage',
      nwPasswordService,
    ]);
})();
