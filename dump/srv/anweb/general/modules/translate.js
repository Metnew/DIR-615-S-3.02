'use strict';
angular.module(regdep('translate'), []).directive('translate', [
  '$rootScope',
  function($rootScope) {
    return {
      restrict: 'AEC',
      scope: !0,
      link: function($scope, $elm, $attrs, $ctrl) {
        function translate() {
          var key = $scope.$langkey;
          key &&
            key.length &&
            $elm.html(
              window.lang && window.lang[key] && '' != window.lang[key]
                ? window.lang[key]
                : window.baselang &&
                  window.baselang[key] &&
                  '' != window.baselang[key]
                  ? window.baselang[key]
                  : key
            );
        }
        $scope.$langkey || ($scope.$langkey = $elm.html()),
          $rootScope.$on('changelang', function() {
            translate();
          }),
          translate();
      },
    };
  },
]),
  angular
    .module('translate')
    .factory('translate', [
      '$rootScope',
      '$http',
      function($rootScope, $http) {
        function translate(key) {
          return key && key.length
            ? window.lang && window.lang[key] && '' != window.lang[key]
              ? window.lang[key]
              : window.baselang &&
                window.baselang[key] &&
                '' != window.baselang[key]
                ? window.baselang[key]
                : key
            : void 0;
        }
        var activeLang = 'eng';
        return (
          ($rootScope.lang = activeLang),
          (translate.checkKey = function(key) {
            return key && key.length
              ? window.lang && window.lang[key] && '' != window.lang[key]
                ? !0
                : window.baselang &&
                  window.baselang[key] &&
                  '' != window.baselang[key]
                  ? !0
                  : !1
              : void 0;
          }),
          (translate.changeLanguage = function(lang) {
            $http({
              method: 'GET',
              url: '/general/lang/' + lang + '.js',
            }).success(function(data, status, headers, config) {
              try {
                eval.apply(window, [data]),
                  ($rootScope.lang = lang),
                  (activeLang = lang),
                  $rootScope.$broadcast('changelang', lang);
              } catch (e) {}
            });
          }),
          (translate.getLang = function() {
            return activeLang;
          }),
          translate
        );
      },
    ])
    .filter('translate', [
      'translate',
      function(translate) {
        return function(input, hideIfEmpty) {
          var result = translate(input);
          return hideIfEmpty && input == result ? '' : result;
        };
      },
    ])
    .directive('translate', [
      '$rootScope',
      'translate',
      function($rootScope, translate) {
        return {
          restrict: 'AEC',
          scope: !0,
          link: function(scope, elm, attrs, ctrl) {
            function change() {
              elm.html(translate(scope.$langkey));
            }
            scope.$langkey || (scope.$langkey = elm.html()),
              $rootScope.$on('changelang', function() {
                change();
              }),
              change();
          },
        };
      },
    ])
    .service('detectLang', function() {
      function detect() {
        var langAttachments = {
            ru: 'rus',
            en: 'eng',
            uk: 'ukr',
            tr: 'tur',
            fr: 'fra',
            ar: 'ara',
            fa: 'fas',
          },
          browserLang = navigator.language
            ? navigator.language
            : navigator.userLanguage;
        return (
          (browserLang = browserLang.toLowerCase().substr(0, 2)),
          browserLang in langAttachments ? langAttachments[browserLang] : 'eng'
        );
      }
      return detect;
    });
