'use strict';
!(function() {
  function nwMenuDirective($document, $timeout) {
    function link($scope, $element) {
      ($scope.menuOpened = !1),
        angular.element($document).on('click', function() {
          $scope.setMenuState(!1);
        }),
        ($scope.toggleMenuState = function($event) {
          $event.stopPropagation(), $scope.setMenuState(!$scope.menuOpened);
        }),
        ($scope.setMenuState = function(opened) {
          $timeout(function() {
            $scope.menuOpened = opened;
          });
        });
    }
    return {
      plain: !0,
      restrict: 'A',
      transclude: !0,
      template:
        '<div class="nw-menu"><div svg-icon="toggle-menu" class="nw-menu__toggler" ng-click="toggleMenuState($event);"></div><div class="nw-menu__list" ng-transclude ng-class="{\'nw-menu__list--hidden\': !menuOpened}"></div></div>',
      link: link,
    };
  }
  function nwMenuItemDirective() {
    function link($scope) {
      $scope.selectItem = function(item) {
        $scope.itemHandler();
      };
    }
    return {
      plain: !0,
      restrict: 'A',
      scope: { itemLabel: '@nwItemLabel', itemHandler: '&nwItemSelect' },
      template:
        '<div class="nw-menu__item" ng-click="selectItem()">{{itemLabel | translate}}</div>',
      link: link,
    };
  }
  angular
    .module(regdep('nw-menu'), [])
    .directive('nwMenu', nwMenuDirective)
    .directive('nwMenuItem', nwMenuItemDirective);
})();
