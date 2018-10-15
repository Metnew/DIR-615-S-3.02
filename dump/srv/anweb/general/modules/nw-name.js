'use strict';
!(function() {
  var nw = angular.module(regdep('nw-name'), []);
  nw.directive('nwName', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, $model) {
        function validator(value) {
          return (
            _.isUndefined(value) ||
              !value.toString().length ||
              $attrs.disabled ||
              $model.$setValidity('invalid_name_length', value.length < 33),
            value
          );
        }
        $model.$parsers.unshift(validator),
          $model.$formatters.unshift(validator);
      },
    };
  });
})();
