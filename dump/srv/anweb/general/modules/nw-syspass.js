'use strict';
!(function() {
  var nw = angular.module(regdep('nw-syspass'), []);
  nw.directive('nwSyspass', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, $model) {
        function validator(value) {
          var reCyrill = /[А-яЁё]+/g,
            reLegal = /^[\x20-\x7E]*$/g;
          return (
            _.isUndefined(value) || !value.toString().length || $attrs.disabled
              ? ($model.$setValidity('invalid_password_length', !0),
                $model.$setValidity('password_contains_cirill', !0),
                $model.$setValidity('password_contains_illegal', !0))
              : ($model.$setValidity(
                  'invalid_password_length',
                  value.length < 32
                ),
                $model.$setValidity(
                  'password_contains_cirill',
                  !reCyrill.test(value)
                ),
                $model.$setValidity(
                  'password_contains_illegal',
                  reLegal.test(value)
                )),
            value
          );
        }
        $model.$parsers.unshift(validator),
          $model.$formatters.unshift(validator);
      },
    };
  });
})();
