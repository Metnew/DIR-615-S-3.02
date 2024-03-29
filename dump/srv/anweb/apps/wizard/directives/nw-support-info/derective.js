'use strict';
!(function() {
  angular.module('wizard').directive('nwSupportInfo', [
    'supportInfoConfig',
    'supportInfoLoader',
    function(config, loader) {
      var template =
        '<div class="support-info-container">	<div class="group" ng-repeat="obj in lines" ng-show="!isUndefined(obj.value())">		<div class="name">{{ obj.langkey | translate }}:</div>		<div class="value">{{ obj.value() }}</div>	</div></div>';
      return {
        restrict: 'A',
        template: template,
        scope: { rewriteParams: '=' },
        link: function($scope, element, attrs) {
          ($scope.lines = []),
            _.each(config.fields, function(field) {
              var item = ($scope.lines[field.name] = {
                value: null,
                langkey: field.langkey,
              });
              (item.value = loader.createGetter(field.name)),
                $scope.lines.push(item);
            }),
            ($scope.isUndefined = _.isUndefined);
        },
      };
    },
  ]);
})();
