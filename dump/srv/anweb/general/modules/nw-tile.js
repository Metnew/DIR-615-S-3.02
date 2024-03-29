'use strict';
!(function() {
  function main() {
    return {
      link: function($scope, element, attrs) {
        $scope.doAction = function() {
          $scope.actionHandler();
        };
      },
      restrict: 'E',
      template:
        '<div class="nw-tile">                            <div class="nw-tile-caption" ng-click="doAction()">                                <div class="icon"><svg svg-icon="{{ icon }}"></svg></div>                                <div class="nw-tile-name">                                    <h5>{{ name | translate }}</h5>                                </div>                            </div>                            <div class="nw-tile-desc">{{ desc | translate }}</div>                            <div class="nw-tile-action" style="display: none;">                                <button class="flat colored" ng-click="doAction()">{{ actionName | translate }}</button>                            </div>                        </div>',
      scope: {
        icon: '@',
        name: '@',
        desc: '@',
        actionName: '@',
        actionHandler: '&',
      },
    };
  }
  angular.module(regdep('nw-tile'), []).directive('nwTile', main),
    (main.$inject = []);
})();
