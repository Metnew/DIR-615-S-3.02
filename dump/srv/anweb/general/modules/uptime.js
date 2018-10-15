'use strict';
angular.module(regdep('nw-up-time'), []).directive('upTime', [
  'translate',
  function(translate) {
    return {
      restrict: 'AE',
      template: '<span>{{sumTime}}</span>',
      scope: { upTime: '=time' },
      link: function(scope, element, attrs) {
        scope.$watch('upTime', function(time) {
          var time = scope.upTime,
            day = 0 == time.d || time.d > 1 ? 'uptimedays' : 'uptimeday';
          scope.sumTime =
            time.d +
            ' ' +
            translate(day) +
            ' ' +
            time.h +
            ':' +
            time.m +
            ':' +
            time.s;
        });
      },
    };
  },
]);
