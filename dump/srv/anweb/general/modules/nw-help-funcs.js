'use strict';
!(function() {
  var nw = angular.module(regdep('nw-help-funcs'), []);
  nw.directive('nwClickAnywhere', function($document) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr, ctrl) {
        elem.bind('click', function(e) {
          e.stopPropagation();
        }),
          $document.bind('click', function() {
            scope.$apply(attr.clickAnywhere),
              angular.element(elem).css('display', 'none');
          });
      },
    };
  }),
    nw.directive('nwClickClearInput', function($document) {
      return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
          elem.bind('focus', function(e) {
            angular.element(elem).val() ==
              angular.element(elem).attr('title') &&
              angular.element(elem).val('');
          }),
            elem.bind('blur', function(e) {
              angular.element(elem).val(angular.element(elem).attr('title'));
            });
        },
      };
    }),
    nw.directive('nwSetFocus', function($timeout) {
      var link = function($scope, $element, $attrs) {
        $attrs.$observe('nwSetFocus', function(value) {
          ('' == $attrs.nwSetFocus || 'true' == $attrs.nwSetFocus) &&
            $timeout(function() {
              $element[0].focus();
            }, 0);
        });
      };
      return { restrict: 'A', link: link };
    }),
    nw.directive('nwBindHtmlCompile', [
      '$compile',
      function($compile) {
        return {
          restrict: 'A',
          link: function($scope, $element, $attrs) {
            $scope.$watch(
              function() {
                return $scope.$eval($attrs.nwBindHtmlCompile);
              },
              function(value) {
                $element.html(value && value.toString());
                var compileScope = $scope;
                $attrs.bindHtmlScope &&
                  (compileScope = $scope.$eval($attrs.bindHtmlScope)),
                  $compile($element.contents())(compileScope);
              }
            );
          },
        };
      },
    ]),
    nw.directive('nwOptionsClass', function($parse) {
      function link($scope, $element, $attrs, $ctrl) {
        var optionsSourceStr = $attrs.ngOptions.split(' ').pop();
        $scope.$watch(optionsSourceStr, function(items) {
          angular.forEach(items, function(item, index) {
            var optionClass = $scope.$eval($attrs.nwOptionsClass, {
                option: item,
                index: index,
              }),
              $option = angular.element($element.find('option')[index]),
              classes = optionClass.split(' ');
            angular.forEach(classes, function(className) {
              $option.addClass(className);
            });
          });
        });
      }
      return { require: 'select', link: link };
    }),
    nw.directive('nwEnterBind', [
      '$document',
      function($document) {
        function link($scope, $element, $attrs) {
          function handler($event) {
            13 === $event.which &&
              $scope.$apply(function() {
                $scope.$eval($attrs.nwEnterBind);
              });
          }
          var $body = angular.element($document[0].body);
          $body.bind('keydown keypress', handler),
            $scope.$on('$destroy', function() {
              $body.unbind('keydown keypress', handler);
            });
        }
        return { restrict: 'A', link: link };
      },
    ]),
    nw.directive('nwNotDirty', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          ctrl.$pristine = !1;
        },
      };
    });
})();
