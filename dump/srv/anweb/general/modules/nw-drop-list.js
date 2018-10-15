'use strict';
!(function() {
  function nwDropList($compile) {
    function link($scope, $element, $attrs, $ctrl) {
      function init() {
        function isDisabled() {
          return $element.attr('disabled');
        }
        ($nwDropBtn = angular.element(templateBtn)),
          ($nwDropList = angular.element($compile(templateList)($scope))),
          $parent.addClass('nw-drop-list-wrap'),
          $parent.prepend($nwDropBtn),
          $parent.append($nwDropList),
          $nwDropBtn.bind('mousedown', function($event) {
            return $event.preventDefault(), !1;
          }),
          $nwDropBtn.bind('click', function() {
            $scope.$broadcast('drop-list-btn.change-active', !isActive);
          }),
          $element.bind('focus', function($event) {
            $scope.$broadcast('element.active');
          }),
          $element.bind('blur', function($event) {
            $scope.$broadcast('element.leave');
          }),
          $element.bind('keydown', function($event) {
            0 != isActive &&
              $event.keyCode == KEY_CODE.TAB &&
              ($scope.$broadcast('element.leave'), $scope.$apply());
          }),
          $scope.$on('drop-list.active', function() {
            (isActive = !0), $nwDropBtn.addClass('nw-drop-list-btn--active');
          }),
          $scope.$on('drop-list.leave', function() {
            (isActive = !1), $nwDropBtn.removeClass('nw-drop-list-btn--active');
          }),
          $scope.$on('drop-list.isEmpty', function($event, value) {
            value
              ? $nwDropBtn.addClass('nw-drop-list-btn--hide')
              : $nwDropBtn.removeClass('nw-drop-list-btn--hide');
          }),
          $scope.$watch(isDisabled, function(value) {
            value
              ? $nwDropBtn.addClass('nw-drop-list-btn--disabled')
              : $nwDropBtn.removeClass('nw-drop-list-btn--disabled');
          });
      }
      var $nwDropBtn,
        $nwDropList,
        $parent = $element.parent(),
        templateBtn = '<i class="nw-drop-list-btn"></i>',
        templateList =
          '<div nw-drop-list-core nw-drop-list-core-value=' +
          $attrs.ngModel +
          ' nw-drop-list-core-options=' +
          $attrs.nwDropListOptions +
          ' ></div>',
        isActive = !1;
      init();
    }
    var KEY_CODE = { TAB: 9 };
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  function nwDropListCore($window, $document) {
    function link($scope, $element, $attrs) {
      function isShow() {
        return (
          $scope.isListActive && ($scope.isElementActive || $scope.workOnList)
        );
      }
      function isEmpty() {
        return !$scope.options.length;
      }
      function updateShowList(value) {
        isEmpty() ||
          (value
            ? ($element.addClass('nw-drop-list--show'),
              $scope.$emit('drop-list.active'),
              correctElementScroll())
            : ($element.removeClass('nw-drop-list--show'),
              $scope.$emit('drop-list.leave'),
              ($scope.isListActive = !1)));
      }
      function updateListState(value) {
        value
          ? $element.addClass('nw-drop-list--hide')
          : $element.removeClass('nw-drop-list--hide'),
          $scope.$emit('drop-list.isEmpty', value);
      }
      function updateValue($event, value) {
        $event.preventDefault(),
          ($scope.value = value),
          ($scope.isListActive = !1);
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
      ($scope.isListActive = !1),
        ($scope.workOnList = !1),
        ($scope.isElementActive = !1),
        ($scope.updateValue = updateValue),
        $scope.$on('drop-list-btn.change-active', function($event, value) {
          ($scope.isListActive = value), value && ($scope.isElementActive = !0);
        }),
        $scope.$on('element.active', function() {
          $scope.isElementActive = !0;
        }),
        $scope.$on('element.leave', function() {
          $scope.isElementActive = !1;
        }),
        $element.bind('mousedown touchstart', function() {
          $scope.workOnList = !0;
        }),
        $element.bind('mouseup touchend', function() {
          $scope.workOnList = !1;
        }),
        $scope.$watch(isShow, updateShowList),
        $scope.$watch(isEmpty, updateListState);
    }
    var template =
      '<div tabindex="-1" class="nw-drop-list" ><div class="nw-drop-list__item" ng-class="{\'nw-drop-list__item--active\': active.check($index) }"ng-click="updateValue($event, option.value)" ng-repeat="option in options" ><span class="nw-drop-list__item-title" ng-bind="option.title"></span> <span class="nw-drop-list__item-subtitle" ng-bind="option.subtitle"></span></div></div>';
    return {
      restrict: 'A',
      replace: !0,
      template: template,
      scope: {
        value: '=nwDropListCoreValue',
        options: '=nwDropListCoreOptions',
      },
      link: link,
    };
  }
  var nw = angular.module(regdep('nw-drop-list'), []);
  nw.directive('nwDropList', ['$compile', nwDropList]),
    nw.directive('nwDropListCore', ['$window', '$document', nwDropListCore]);
})();
