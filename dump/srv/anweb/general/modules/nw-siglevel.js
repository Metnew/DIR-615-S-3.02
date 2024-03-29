'use strict';
!(function() {
  var nw = angular.module(regdep('nw-siglevel'), []);
  nw.directive('nwSiglevel', [
    '$compile',
    function($compile) {
      return {
        restrict: 'A',
        template: '',
        scope: { nwSiglevel: '=' },
        link: function(scope, element, attrs) {
          var template,
            siglvl = scope.nwSiglevel,
            isMatch = siglvl.match(/^(\d{1,2}|100)%$/),
            bars =
              '<div class="first-bar bar"></div><div class="second-bar bar"></div><div class="third-bar bar"></div><div class="fourth-bar bar"></div><div class="fifth-bar bar"></div>';
          if (_.isNull(isMatch)) template = '<span>' + siglvl + '</span>';
          else {
            var percent = isMatch[1],
              signal = Math.ceil(parseInt(percent) / 20);
            switch (signal) {
              case 0:
                template =
                  '<div class="signal-bars mt1 sizing-box absent one-bar">' +
                  bars +
                  '</div> <span>' +
                  percent +
                  '%</span>';
                break;
              case 1:
                template =
                  '<div class="signal-bars mt1 sizing-box bad one-bar">' +
                  bars +
                  '</div> <span>' +
                  percent +
                  '%</span>';
                break;
              case 2:
                template =
                  '<div class="signal-bars mt1 sizing-box bad two-bars">' +
                  bars +
                  '</div> <span>' +
                  percent +
                  '%</span>';
                break;
              case 3:
                template =
                  '<div class="signal-bars mt1 sizing-box ok three-bars">' +
                  bars +
                  '</div> <span>' +
                  percent +
                  '%</span>';
                break;
              case 4:
                template =
                  '<div class="signal-bars mt1 sizing-box good four-bars">' +
                  bars +
                  '</div> <span>' +
                  percent +
                  '%</span>';
                break;
              case 5:
                template =
                  '<div class="signal-bars mt1 sizing-box best fifth-bars">' +
                  bars +
                  '</div> <span>' +
                  percent +
                  '%</span>';
            }
          }
          $compile(template)(scope);
          element.append(template);
        },
      };
    },
  ]);
})();
