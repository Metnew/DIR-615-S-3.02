'use strict';
angular.module(regdep('nw-langlist'), []).directive('nwLanglist', [
  'translate',
  '$rootScope',
  'cookie',
  function(translate, $rootScope, cookie) {
    return {
      restrict: 'A',
      transclude: !0,
      scope: {},
      template:
        '<div><div class="lang_active" ng-click="expand()">{{\'language\'|translate}}:<div class="lang_list" ng-class="{ focused: !!lang_list.length }">{{lang|translate}}&nbsp;<div class="lng"><img src="img/lang/{{lang}}.png"></div><div ng-repeat="name in lang_list|filter:lang:filterfn" ng-click="change(name)">{{name|translate}}</div></div></div></div>',
      link: function($scope, element, attrs) {
        ($scope.lang_list = []),
          $rootScope.$on('changelang', function(event, lang) {
            $scope.lang = lang;
          }),
          ($scope.filterfn = function(actual, expected) {
            return !angular.equals(actual, expected);
          }),
          ($scope.expand = function() {
            $scope.lang_list =
              $scope.lang_list.length > 0
                ? []
                : [
                    'rus',
                    'eng',
                    'ara',
                    'fas',
                    'ukr',
                    'fra',
                    'heb',
                    'lit',
                    'tur',
                  ];
          }),
          ($scope.change = function(lang) {
            cookie.set('lang', lang), translate.changeLanguage(lang);
          });
      },
    };
  },
]);
