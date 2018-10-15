'use strict';
!(function() {
  var nw = angular.module(regdep('nw-progress-bar'), []);
  nw.directive('nwProgressBar', function() {
    function pbTypeClass(pbType) {
      return pbTypeClasses[pbType] || '';
    }
    var pbTypeClasses = { indeter: 'indeter' };
    return {
      template:
        '<div class="nw-progress-bar {{pbTypeClass}} {{pbHidden ? \'hidden\' : \'\'}}"><div class="nw-progress-text">{{pbText}}</div><div class="nw-progress-bg"></div><div class="nw-progress-band" ng-style="{\'width\':pbValue + \'%\', \'background-color\': getProgressColor()}"></div></div>',
      replace: !0,
      plain: !0,
      restrict: 'AE',
      scope: { pbValue: '=', pbText: '=', pbType: '=', pbHidden: '=' },
      link: function($scope) {
        var maxColorChannelValue = 215;
        ($scope.pbTypeClass = pbTypeClass($scope.pbType)),
          ($scope.getProgressColor = function() {
            return $scope.pbValue
              ? $scope.pbValue <= 50
                ? 'rgb(' +
                  parseInt((maxColorChannelValue * $scope.pbValue) / 50) +
                  ',' +
                  maxColorChannelValue +
                  ',0)'
                : 'rgb(' +
                  maxColorChannelValue +
                  ',' +
                  (maxColorChannelValue -
                    parseInt(
                      (maxColorChannelValue * ($scope.pbValue - 50)) / 50
                    )) +
                  ',0)'
              : "'inhierit'";
          });
      },
    };
  }),
    nw.directive('nwAutoProgressBar', [
      '$interval',
      function($interval) {
        return {
          template:
            '<nw-progress-bar pb-value="calcValue()"></nw-progress-bar>',
          restrict: 'AE',
          scope: { pbDuration: '=', pbPause: '=', pbCallback: '&' },
          link: function($scope) {
            function start() {
              (value = 0),
                $interval.cancel(promise),
                pbCallback('started'),
                (promise = $interval(function() {
                  (value += intervalValue),
                    value >= $scope.pbDuration &&
                      ($interval.cancel(promise), pbCallback('finished'));
                }, intervalValue));
            }
            function stop() {
              $interval.cancel(promise);
            }
            function pbCallback(status) {
              $scope.pbCallback && $scope.pbCallback({ status: status });
            }
            var promise = null,
              intervalValue = 1e3,
              value = 0;
            ($scope.calcValue = function() {
              return (value / $scope.pbDuration) * 100;
            }),
              $scope.$watch('pbPause', function(pbPause) {
                pbPause === !1 ? start() : stop();
              });
          },
        };
      },
    ]);
})();
