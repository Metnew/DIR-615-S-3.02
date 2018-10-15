'use strict';
!(function() {
  function NotificationDirective() {
    function link($scope, $element, $attrs) {
      $scope.hasActions = function() {
        return _.size($scope.notification.actions);
      };
    }
    var directive = {
      link: link,
      restrict: 'A',
      scope: { notification: '=nwNotification' },
      plain: !0,
      replace: !0,
      template:
        '<div class="nw-notification card"><div class="nw-notification__icon" svg-icon="{{notification.icon}}"></div><div class="nw-notification__content"><div class="nw-notification__title" ng-bind="\'notification\' | translate"></div><div class="nw-notification__description" ng-bind="notification.getDescription() | translate"></div><div class="nw-notification__actions-block" ng-if="hasActions()"><button class="flat nw-notification__action"ng-repeat="action in notification.actions"ng-class="{\'colored\': action.primary}"ng-click="action.handler()"><span class="button__svg-icon" svg-icon="{{action.icon}}"></span>{{action.text | translate}}</button></div></div><div class="nw-notification__close-btn" ng-if="notification.close" ng-click="notification.close()"><div svg-icon="cross-medium"></div></div></div>',
    };
    return directive;
  }
  angular
    .module(regdep('nw-notification'), [])
    .directive('nwNotification', NotificationDirective),
    (NotificationDirective.$inject = []);
})();
