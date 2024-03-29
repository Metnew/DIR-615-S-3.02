'use strict';
!(function() {
  function nwAutocomplete($compile) {
    function link($scope, $element, $attrs, $ctrl) {
      function setActive(val) {
        isActive = val;
      }
      function getActive() {
        return isActive;
      }
      function init() {
        ($autocomplete = angular.element($compile(template)($scope))),
          $parent.addClass('nw-autocomplete-wrap'),
          $parent.append($autocomplete),
          $element.bind('focus', function($event) {
            $scope.$broadcast('input.focus');
          }),
          $element.bind('blur', function($event) {
            $scope.$broadcast('input.blur');
          }),
          $element.bind('keydown', function($event) {
            if (0 != getActive()) {
              switch ($event.keyCode) {
                case KEY_CODE.TAB:
                  $scope.$broadcast('input.tab');
                  break;
                case KEY_CODE.ENTER:
                  $scope.$broadcast('input.enter'), $event.preventDefault();
                  break;
                case KEY_CODE.UP_ARROW:
                  $scope.$broadcast('input.up'), $event.preventDefault();
                  break;
                case KEY_CODE.DOWN_ARROW:
                  $scope.$broadcast('input.down'), $event.preventDefault();
              }
              ($event.keyCode == KEY_CODE.TAB ||
                $event.keyCode == KEY_CODE.ENTER ||
                $event.keyCode == KEY_CODE.UP_ARROW ||
                $event.keyCode == KEY_CODE.DOWN_ARROW) &&
                $scope.$apply();
            }
          }),
          $scope.$on('input.focus.set', function() {
            $element[0].focus();
          }),
          $scope.$on('autocomplete.show', function() {
            setActive(!0);
          }),
          $scope.$on('autocomplete.leave', function() {
            setActive(!1);
          });
      }
      var $autocomplete,
        $parent = $element.parent(),
        isActive = !1,
        template =
          '<div nw-autocomplete-core nw-autocomplete-core-value=' +
          $attrs.ngModel +
          '  nw-autocomplete-core-options=' +
          $attrs.nwAutocompleteOptions +
          ' ></div>';
      init();
    }
    var KEY_CODE = { TAB: 9, ENTER: 13, UP_ARROW: 38, DOWN_ARROW: 40 };
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  function nwAutocompleteCore($window, $document) {
    function link($scope, $element, $attrs) {
      function correct() {
        $scope.options.correct(),
          $scope.active.correct(),
          $scope.$apply(),
          updateScroll();
      }
      function isShow() {
        return (
          (focus.is() || elementActive.is()) &&
          !stop.is() &&
          !$scope.options.isEmpty() &&
          !$scope.options.isSelect()
        );
      }
      function selectItem($event, index) {
        $event.preventDefault(), setValue(index);
      }
      function setValue(index) {
        if (!_.isUndefined(index)) {
          var option = $scope.options.get(index);
          ($scope.value = option.value), $scope.$emit('input.focus.set', !0);
        }
      }
      function updateScroll() {
        function scrollTopFn(element, value) {
          'scrollTopAnimated' in $document
            ? angular.element(element).scrollTopAnimated(value)
            : (element.scrollTop = value);
        }
        var childrens = $element.children();
        if (childrens.length) {
          var container = $element[0],
            item = $element.children()[0],
            index = $scope.active.index,
            allHeight = container.clientHeight + 1,
            scrollTop = container.scrollTop,
            height = item.offsetHeight,
            top = height * index,
            bottom = top + height;
          bottom > allHeight + scrollTop
            ? scrollTopFn(container, bottom - allHeight)
            : scrollTop > top && scrollTopFn(container, top);
        }
      }
      function correctElementScroll() {
        function getScrollTop() {
          return (
            $window.scrollY ||
            $document[0].documentElement.scrollTop ||
            $document[0].body.scrollTop
          );
        }
        var body = $document[0].body,
          container = $element[0],
          bodyCords = body.getBoundingClientRect(),
          containerCords = container.getBoundingClientRect(),
          bodyBottom = bodyCords.bottom - bodyCords.top,
          containerBottom = containerCords.bottom;
        if (containerBottom > bodyBottom) {
          var scrollTop = getScrollTop(),
            scrollHeight = containerBottom - bodyBottom + 20;
          'scrollTopAnimated' in $document
            ? $document.scrollTopAnimated(scrollTop + scrollHeight)
            : $window.scrollTo(0, scrollTop + scrollHeight);
        }
      }
      var stop = {
          value: !1,
          set: function(val) {
            this.value = val;
          },
          get: function() {
            return this.value;
          },
          is: function() {
            return 1 == this.value;
          },
        },
        focus = {
          value: !1,
          set: function(val) {
            this.value = val;
          },
          get: function() {
            return this.value;
          },
          is: function() {
            return 1 == this.value;
          },
        },
        elementActive = {
          value: !1,
          is: function() {
            return 1 == this.value;
          },
          set: function(val) {
            this.value = val;
          },
        };
      ($scope.options = {
        list: [],
        clean: function() {
          this.list.length = 0;
        },
        get: function(index) {
          return this.list[index];
        },
        has: function(data) {
          return _.some(this.list, function(elem) {
            return elem.value == data.value;
          });
        },
        findIndex: function(data) {
          if (!data) return 0;
          for (var inx = 0; inx < this.list.length; inx++)
            if (this.list[inx].value == data.value) return inx;
          return 0;
        },
        isEmpty: function() {
          return 0 == this.list.length;
        },
        isSelect: function() {
          return 1 == this.list.length && this.list[0].value == $scope.value;
        },
        correct: function() {
          function filter(options, value) {
            function match(str, substr) {
              _.isString(str) || (str = str.toString()),
                _.isString(substr) || (substr = substr.toString());
              var pattern = new RegExp('^' + substr),
                result = str.match(pattern);
              return result && result[0];
            }
            return _.filter(options, function(option) {
              return value ? match(option.value, value) : !0;
            });
          }
          this.list = filter($scope.allOptions, $scope.value);
        },
      }),
        ($scope.active = {
          data: null,
          index: null,
          clean: function() {
            (this.data = null), (this.index = null);
          },
          set: function(val) {
            this.data = val;
          },
          get: function() {
            return this.data;
          },
          check: function(index) {
            return this.data && this.index == index;
          },
          dec: function() {
            (this.index = this.index - 1),
              (this.data = $scope.options.get(this.index));
          },
          inc: function() {
            (this.index = this.index + 1),
              (this.data = $scope.options.get(this.index));
          },
          isFirst: function() {
            return 0 == this.index;
          },
          isLast: function() {
            return this.index == $scope.options.list.length - 1;
          },
          correct: function() {
            var index = $scope.options.findIndex(this.data);
            (this.data = $scope.options.get(index)), (this.index = index);
          },
        }),
        $element.bind('mousedown', function() {
          elementActive.set(!0);
        }),
        $element.bind('mouseup', function() {
          elementActive.set(!1), $scope.$emit('input.focus.set', !0);
        }),
        $scope.$on('input.focus', function() {
          focus.set(!0);
        }),
        $scope.$on('input.blur', function() {
          focus.set(!1);
        }),
        $scope.$on('input.tab', function() {
          focus.set(!1);
        }),
        $scope.$on('autocomplete.stop', function() {
          stop.set(!0);
        }),
        $scope.$on('autocomplete.start', function() {
          stop.set(!1);
        }),
        $scope.$on('input.enter', function() {
          setValue($scope.active.index);
        }),
        $scope.$on('input.up', function() {
          $scope.active.isFirst() || ($scope.active.dec(), updateScroll());
        }),
        $scope.$on('input.down', function() {
          $scope.active.isLast() || ($scope.active.inc(), updateScroll());
        }),
        ($scope.isShow = isShow),
        ($scope.selectItem = selectItem),
        ($scope.setValue = setValue),
        ($scope.updateScroll = updateScroll);
      var correctLazy = _.debounce(correct, 50);
      $scope.$watch('defaultValue', function(newValue) {
        newValue && ($scope.value = newValue);
      }),
        $scope.$watch('value', correctLazy),
        $scope.$watch(isShow, function(val) {
          val
            ? ($element.addClass('nw-autocomplete--show'),
              $scope.$emit('autocomplete.show'),
              $scope.active.correct(),
              correctElementScroll(),
              updateScroll())
            : ($element.removeClass('nw-autocomplete--show'),
              $scope.$emit('autocomplete.leave'),
              $scope.active.clean());
        });
    }
    var template =
      '<div tabindex="-1" class="nw-autocomplete" ><div class="nw-autocomplete__item" ng-class="{\'nw-autocomplete__item--active\': active.check($index) }"ng-click="selectItem($event, $index)" ng-repeat="option in options.list" ng-bind="option.title"></div></div>';
    return {
      restrict: 'A',
      replace: !0,
      template: template,
      scope: {
        value: '=nwAutocompleteCoreValue',
        allOptions: '=nwAutocompleteCoreOptions',
      },
      link: link,
    };
  }
  var nw = angular.module(regdep('nw-autocomplete'), []);
  nw.directive('nwAutocomplete', ['$compile', nwAutocomplete]),
    nw.directive('nwAutocompleteCore', [
      '$window',
      '$document',
      nwAutocompleteCore,
    ]);
})();
