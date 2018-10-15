'use strict';
!(function() {
  angular.module('app').directive('urlWrapper', [
    '$location',
    function($location) {
      function link($scope, $element, $attrs, $model) {
        function needUpdateFavicon() {
          return stopWatching;
        }
        function updateFavicon() {
          var url = $model.$viewValue,
            style = {};
          if (url) {
            style.display = 'block';
            var path = $location.protocol() + '://' + url + '/favicon.ico';
            (style.background = "url('" + path + "') no-repeat center center"),
              (style['background-size'] = 'contain'),
              (style.bottom = '10px'),
              (style.height = '16px'),
              (style.right = '35px'),
              (style.width = '16px');
          } else style.display = 'none';
          $btn.css(style);
        }
        var $parent = $element.parent(),
          $btn = angular.element('<i class="url_favicon noselect"></i>'),
          stopWatching = !1;
        $parent.addClass('url_wrapper'),
          $parent.prepend($btn),
          $element.bind('focus', function() {
            stopWatching = !0;
          }),
          $element.bind('blur', function() {
            stopWatching = !1;
          }),
          $scope.$watch(needUpdateFavicon, updateFavicon),
          updateFavicon();
      }
      return { restrict: 'A', require: 'ngModel', link: link };
    },
  ]);
})();
