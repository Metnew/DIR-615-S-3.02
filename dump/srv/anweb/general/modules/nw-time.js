'use strict';
!(function() {
  function nwTime(funcs, translate) {
    function link($scope, $element, $attrs) {
      $scope.$watch('nwTime', function(sec) {
        if (sec) {
          var obj = funcs.format.time(sec, ['day', 'hour', 'minute']),
            result = [];
          obj.day && result.push(obj.day + ' ' + translate('day')),
            obj.hour && result.push(obj.hour + ' ' + translate('hour')),
            result.push(obj.minute + ' ' + translate('minute')),
            ($scope.result = result.join(', '));
        } else $scope.result = '-';
      });
    }
    return {
      restrict: 'AEC',
      link: link,
      scope: { nwTime: '=' },
      template: '{{result}}',
    };
  }
  var nw = angular.module(regdep('nw-time'), []);
  nw.directive('nwTime', ['funcs', 'translate', nwTime]);
})();
