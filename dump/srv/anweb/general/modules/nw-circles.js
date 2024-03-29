'use strict';
!(function() {
  var nw = angular.module(regdep('nw-circles'), []);
  nw.directive('nwCircles', [
    '$rootScope',
    function($rootScope) {
      return {
        restrict: 'AEC',
        scope: { nwCircles: '=', nwCirclesPause: '=', nwCirclesCallback: '&' },
        template: '<div class="mycircle_wrap"></div>',
        link: function($scope, $element, $attr) {
          function callback(status) {
            $scope.nwCirclesCallback &&
              $scope.nwCirclesCallback({ status: status });
          }
          var intervalID,
            paused = !1;
          $scope.$watch('nwCirclesPause', function(isPaused) {
            paused = !!isPaused;
          }),
            $scope.$watch('nwCircles', function(progress_max) {
              if (
                (callback('started'),
                progress_max && parseInt(progress_max) >= 0)
              ) {
                var circles, circle_count, progress_max, progress, i, lastStamp;
                !(function() {
                  var calcApplyCircleMargin = function(index) {
                      return Math.min(
                        ((progress -
                          (progress_max / circle_count) * (index + 1)) /
                          (progress_max / 10)) *
                          11,
                        0
                      );
                    },
                    calcApplyCircleShow = function(index) {
                      return progress >= (progress_max / circle_count) * index;
                    };
                  for (
                    circles = $element.find('div')[0],
                      circle_count = 10,
                      progress_max = parseInt($scope.nwCircles),
                      progress = 0,
                      angular.element(circles).empty(),
                      i = 0;
                    circle_count > i;
                    i++
                  )
                    angular
                      .element(circles)
                      .append(
                        '<span class="circle"><div class="bg"></div></span>'
                      );
                  (lastStamp = _.now()),
                    (intervalID = setInterval(function() {
                      if (!paused) {
                        (progress += _.now() - lastStamp),
                          (lastStamp = _.now());
                        var circlesArray = angular.element(circles).find('div');
                        if (!circlesArray || 0 == circlesArray.length)
                          return void clearTimeout(intervalID);
                        for (var i = 0; circle_count > i; i++)
                          angular
                            .element(circlesArray[i])
                            .css(
                              'margin-left',
                              calcApplyCircleMargin(i) + 'px'
                            ),
                            angular
                              .element(circlesArray[i])
                              .css(
                                'display',
                                calcApplyCircleShow(i) ? 'block' : 'none'
                              );
                        progress >= progress_max &&
                          ($rootScope.$broadcast('cricle_bar_finished'),
                          clearTimeout(intervalID),
                          callback('finished'));
                      }
                    }, 200));
                })();
              } else clearTimeout(intervalID);
            });
        },
      };
    },
  ]),
    nw.directive('nwStepCircles', [
      '$interval',
      function($interval) {
        return {
          restrict: 'AEC',
          scope: {
            nwStepCirclesCount: '=',
            nwStepCirclesValue: '=',
            nwAutoAnim: '=',
            nwAutoAnimFinished: '=',
          },
          template:
            '<div class="mycircle_wrap"> 					<span class="circle" ng-repeat="i in count"> 						<div ng-if="!nwAutoAnim" class="bg" ng-style="{display: (nwStepCirclesValue > i)?\'block\':\'none\'}"></div> 						<div ng-if="nwAutoAnim" class="bg" ng-style="{display: (incr > i)?\'block\':\'none\'}"></div> 					</span> 				</div>',
          link: function($scope, $element, $attr) {
            if (
              (($scope.count = _.range($scope.nwStepCirclesCount)),
              ($scope.incr = 0),
              $scope.nwAutoAnim)
            ) {
              var intervalID = $interval(function() {
                $scope.incr++,
                  $scope.nwAutoAnimFinished &&
                  $scope.incr == $scope.nwStepCirclesCount
                    ? $interval.cancel(intervalID)
                    : $scope.incr > $scope.nwStepCirclesCount &&
                      ($scope.incr = 0);
              }, 2e3);
              $scope.$on('$destroy', function() {
                $interval.cancel(intervalID);
              });
            }
          },
        };
      },
    ]);
})();
