'use strict';
!(function() {
  var nw = angular.module(regdep('nw-view-line'), []);
  nw.directive('nwViewLine', [
    '$q',
    '$timeout',
    'translate',
    function($q, $timeout, translate) {
      function link($scope, $element, $attrs) {
        function initView(views) {
          !_.isUndefined(views) &&
            _.isUndefined($scope.state) &&
            ($scope.state = $scope.possibleViews[0].value);
        }
        function hasFunction(name) {
          var attr = $attrs['nwViewLine' + capitalizeFirstLetter(name)];
          return _.isUndefined(attr) ? !1 : !0;
        }
        function getFunctionArgs(name) {
          if (!hasFunction(name)) return [];
          var reg = /\((.*)\)/,
            attr = $attrs['nwViewLine' + capitalizeFirstLetter(name)],
            matches = attr.match(reg);
          return matches && matches.length && matches[1]
            ? matches[1].replace(/\s/g, '').split(',')
            : [];
        }
        function capitalizeFirstLetter(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }
        var changeViewPrepare = {
            has: hasFunction('changeViewPrepare'),
            args: getFunctionArgs('changeViewPrepare'),
          },
          changeViewSuccess = {
            has: hasFunction('changeViewSuccess'),
            args: getFunctionArgs('changeViewSuccess'),
          };
        ($scope.changeView = function($event, nextView) {
          function isPrepare() {
            return changeViewPrepare.has;
          }
          function isSuccess() {
            return changeViewSuccess.has;
          }
          function prepare() {
            var params = getParams(changeViewPrepare.args);
            $q.when($scope.changeViewPrepare(params)).then(function(value) {
              value && isSuccess() && success();
            });
          }
          function success() {
            var params = getParams(changeViewSuccess.args);
            $scope.changeViewSuccess(params);
          }
          function getParams(args) {
            var params = {};
            return (
              (params[args[0]] = nextView),
              (params[args[1]] = $scope.state),
              params
            );
          }
          return isPrepare() ? void prepare() : void (isSuccess() && success());
        }),
          $scope.$watch('possibleViews', initView);
      }
      var nwViewLine = {
        restrict: 'A',
        replace: !0,
        scope: {
          possibleViews: '=nwViewLinePossibleViews',
          state: '=nwViewLineState',
          changeViewPrepare: '&nwViewLineChangeViewPrepare',
          changeViewSuccess: '&nwViewLineChangeViewSuccess',
        },
        template:
          '<div class="view-general-line"><span class="view-general-tabs" ng-repeat="view in possibleViews" ng-click="changeView($event, view.value)" ng-class="{\'view-general-tabs--active\': view.value == state}"ng-bind="view.description | translate"></span></div>',
        link: link,
      };
      return nwViewLine;
    },
  ]);
})();
