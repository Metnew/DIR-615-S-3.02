!(function(angular) {
  'use strict';
  var app = angular.module('angular-progress-arc', []);
  app.provider('progressArcDefaults', function() {
    var defaults = {
      size: 200,
      strokeWidth: 10,
      stroke: '#2f7ca6',
      background: '#eee',
      counterClockwise: 1,
    };
    (this.setDefault = function(name, value) {
      return (defaults[name] = value), this;
    }),
      (this.$get = function() {
        return function(attr) {
          angular.forEach(defaults, function(value, key) {
            attr[key] || (attr[key] = value);
          });
        };
      });
  }),
    app.provider('progressbar', function() {
      this.$get = [
        '$rootScope',
        '$compile',
        function($rootScope, $compile) {
          var timer,
            scope = $rootScope.$new();
          return (
            (scope.show = !1),
            (scope.complete = 0),
            (scope.message = ''),
            (scope.submessage = ''),
            (function() {
              var template =
                  '<div class="overley" ng-show="show"> <div class="overley_bg"> </div> <div class="overley_preload overlay_arc"> <div class="progress_arc" progress-arc complete="complete" message="{{message}}" submessage="{{submessage}}"></div></div> </div>',
                el = $compile(template)(scope);
              angular
                .element(document)
                .find('body')
                .append(el);
            })(),
            {
              open: function(fulltime, submessage, cb) {
                function time_format(ms) {
                  return parseInt(ms / 1e3);
                }
                (scope.show = !0),
                  (scope.message = time_format(fulltime)),
                  (scope.submessage = submessage);
                var time = fulltime;
                timer = setInterval(function() {
                  (scope.message = time_format(time)),
                    time
                      ? (time -= 500)
                      : ((cb || angular.noop)(), clearInterval(timer)),
                    (scope.complete = 1 - time / fulltime),
                    scope.$digest();
                }, 500);
              },
              close: function() {
                clearInterval(timer), (scope.show = !1), scope.$digest();
              },
            }
          );
        },
      ];
    }),
    app.directive('progressArc', [
      'progressArcDefaults',
      function(progressArcDefaults) {
        return {
          restrict: 'AE',
          scope: {
            message: '@',
            submessage: '@',
            size: '@',
            strokeWidth: '@',
            stroke: '@',
            counterClockwise: '@',
            complete: '&',
            background: '@',
          },
          compile: function(element, attr) {
            return (
              progressArcDefaults(attr),
              function(scope, element, attr) {
                scope.offset = /firefox/i.test(navigator.userAgent)
                  ? -89.9
                  : -90;
                var updateRadius = function() {
                  (scope.strokeWidthCapped = Math.min(
                    scope.strokeWidth,
                    scope.size / 2 - 1
                  )),
                    (scope.radius = Math.max(
                      (scope.size - scope.strokeWidthCapped) / 2 - 1,
                      0
                    )),
                    (scope.circumference = 2 * Math.PI * scope.radius);
                };
                scope.$watchCollection('[size, strokeWidth]', updateRadius),
                  updateRadius();
              }
            );
          },
          template:
            '<svg ng-attr-width="{{size}}" ng-attr-height="{{size}}" class="progressArc"><circle fill="none" ng-if="background" ng-attr-cx="{{size/2}}" ng-attr-cy="{{size/2}}" ng-attr-r="{{radius}}" ng-attr-stroke="{{background}}" ng-attr-stroke-width="{{strokeWidthCapped}}"/><circle fill="none" ng-attr-cx="{{size/2}}" ng-attr-cy="{{size/2}}" ng-attr-r="{{radius}}" ng-attr-stroke="{{stroke}}" ng-attr-stroke-width="{{strokeWidthCapped}}"ng-attr-stroke-dasharray="{{circumference}}"ng-attr-stroke-dashoffset="{{(counterClockwise?-1:1)*(1+complete())*circumference}}"ng-attr-transform="rotate({{offset}}, {{size/2}}, {{size/2}})"/><text ng-attr-x="{{size/2}}" ng-attr-y="{{size/2 + 35}}" font-size="30px" text-anchor="middle" alignment-baseline="middle" ng-bind="message"></text><text ng-attr-x="{{size/2}}" ng-attr-y="{{size/2 - 5}}" font-size="16px" text-anchor="middle" alignment-baseline="middle" ng-bind="submessage"></text></svg>',
        };
      },
    ]);
})(window.angular);
