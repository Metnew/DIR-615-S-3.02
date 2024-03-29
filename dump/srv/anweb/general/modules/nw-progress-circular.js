'use strict';
!(function() {
  function nwProgressCircular() {
    function link($scope) {
      $scope.dots = _.range(8);
    }
    return {
      plain: !0,
      restrict: 'AE',
      replace: !0,
      template:
        '<div class="circular_spinner svg_spinner"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/></svg></div>',
      link: link,
    };
  }
  function nwProgressMiniCircular() {
    function link($scope) {
      $scope.dots = _.range(8);
    }
    return {
      plain: !0,
      restrict: 'AE',
      replace: !0,
      template:
        '<div class="circular_spinner_mini svg_spinner"><svg class="mini_circular" viewBox="16px 16px 16px 16px"><circle class="mini_path" cx="8px" cy="8px" r="5px" fill="none" stroke-width="4" stroke-miterlimit="10"/></svg></div>',
      link: link,
    };
  }
  var nw = angular.module(regdep('nw-progress-circular'), []);
  nw.directive('nwProgressCircular', nwProgressCircular),
    nw.directive('nwProgressMiniCircular', nwProgressMiniCircular);
})();
