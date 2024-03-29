'use strict';
!(function() {
  var nw = angular.module(regdep('nw-flat-switch'), []);
  nw.directive('nwFlatSwitch', function() {
    var controller = function($scope) {
      $scope.changeState = function() {
        ($scope.state = !$scope.state), $scope.nwAction();
      };
    };
    return {
      restrict: 'A',
      scope: !0,
      controller: controller,
      template:
        '<div class="button_block no_top_margin"><button type="button" class="colored flat no_margin no_min_width" ></button><button type="button" class="colored flat no_margin no_min_width" ></button></div>',
      compile: function($elem, $attr) {
        var state = $attr.nwState,
          textEn = $attr.nwTextEnable,
          textDis = $attr.nwTextDisable,
          action = $attr.nwAction,
          buttons = $elem.find('button'),
          but1 = angular.element(buttons[0]),
          but2 = angular.element(buttons[1]);
        but1.attr('ng-bind', "'" + textEn + "' | translate"),
          but1.attr('ng-if', '!' + state),
          but1.attr('ng-click', state + ' = !' + state + '; ' + action + '()'),
          but2.attr('ng-bind', "'" + textDis + "' | translate"),
          but2.attr('ng-if', state),
          but2.attr('ng-click', state + ' = !' + state + '; ' + action + '()');
      },
    };
  });
})();
