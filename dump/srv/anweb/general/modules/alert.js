'use strict';
angular.module(regdep('nw-alert'), []).directive('alert', [
  function() {
    return {
      restrict: 'A',
      transclude: !0,
      scope: { alert: '@' },
      template:
        '<svg class="icon"><use xlink:href="/general/img/svg/sprite.symbol.svg#warningNew"></use></svg><div ng-transclude class="content"></div>',
      link: function($scope, element, attrs) {
        var alertClass = $scope.alert || 'warning';
        element.addClass('alert'), element.addClass(alertClass);
      },
    };
  },
]);
