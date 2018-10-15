'use strict';
angular.module(regdep('nw-empty-state'), []).directive('nwEmptyState', [
  function() {
    var compile = function($element, $attrs) {
      function startTemplate() {
        return '<div class="empty_state_container">';
      }
      function getTitle() {
        return (
          '<div class="empty_state_title" ng-bind="\'' +
          $attrs.nwEmptyStateTitle +
          '\' | translate"></div>'
        );
      }
      function getSubtitle() {
        return (
          '<div class="empty_state_subtitle" ng-bind="\'' +
          $attrs.nwEmptyStateSubtitle +
          '\' | translate"> </div>'
        );
      }
      function getButton() {
        var result = '<div class="empty_state_buttons_panel">';
        return (
          (result +=
            '<button type="button" class="colored flat" ng-bind="\'' +
            $attrs.nwEmptyStateButton +
            '\' | translate"ng-click="' +
            $attrs.nwEmptyStateButtonClick +
            '"></button>'),
          $attrs.nwEmptyStateButton2 &&
            (result +=
              '<button type="button" class="colored flat" ng-bind="\'' +
              $attrs.nwEmptyStateButton2 +
              '\' | translate"ng-click="' +
              $attrs.nwEmptyStateButton2Click +
              '"></button>'),
          (result += '</div>')
        );
      }
      function endTemplate() {
        return '</div>';
      }
      var template = '';
      (template += startTemplate()),
        $attrs.nwEmptyStateTitle && (template += getTitle()),
        $attrs.nwEmptyStateButton && (template += getButton()),
        $attrs.nwEmptyStateSubtitle && (template += getSubtitle()),
        (template += endTemplate()),
        $element.append(template);
    };
    return { restrict: 'A', replace: !0, compile: compile };
  },
]);
