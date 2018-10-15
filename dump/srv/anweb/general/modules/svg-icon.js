'use strict';
!(function() {
  function SvgIconDirective() {
    return {
      restrict: 'A',
      replace: !0,
      scope: { svgIcon: '@' },
      template:
        '<svg class="icon"><use ng-href="{{\'/general/img/svg/sprite.symbol.svg#\' + svgIcon}}" xlink:href=""></use></svg>',
    };
  }
  var svgIconModule = angular.module(regdep('svgIcon'), []);
  svgIconModule.directive('svgIcon', [SvgIconDirective]);
})();
