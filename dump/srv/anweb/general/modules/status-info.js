'use strict';
!(function() {
  function statusInfo() {
    function link($scope, element, attrs) {
      function statusClass(status) {
        return statusClasses[status];
      }
      function updateState() {
        ($scope.className = statusClass($scope.status)),
          ($scope.statusString = $scope[$scope.status]);
      }
      var statusClasses = {
        on: 'on',
        off: 'off',
        pending: 'pending',
        disconnected: 'disconnected',
      };
      attrs.$observe('status', updateState),
        attrs.$observe('on', updateState),
        attrs.$observe('off', updateState),
        attrs.$observe('pending', updateState),
        attrs.$observe('disconnected', updateState);
    }
    var template =
        '<span class="status-info">{{statusString}}</span>                        <div ng-if="status == loading" class="circular_spinner_mini svg_spinner">                            <svg class="mini_circular" viewBox="16px 16px 16px 16px">                                <circle class="mini_path" cx="8px" cy="8px" r="5px" fill="none" stroke-width="4" stroke-miterlimit="10"/>                            </svg>                        </div>                        <span ng-if="status != loading" class="status-circle {{className}}"></span>',
      directive = {
        link: link,
        restrict: 'E',
        template: template,
        scope: {
          status: '@',
          on: '@',
          off: '@',
          pending: '@',
          disconnected: '@',
        },
      };
    return directive;
  }
  angular
    .module(regdep('nw-status-info'), [])
    .directive('statusInfo', statusInfo),
    (statusInfo.$inject = []);
})();
