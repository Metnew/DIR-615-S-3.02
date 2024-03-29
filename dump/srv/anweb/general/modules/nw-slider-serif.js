'use strict';
!(function() {
  angular.module(regdep('nw-slider-serif'), []).directive('nwSliderSerif', [
    'translate',
    function(translate) {
      return {
        template:
          '<span><div class="nw-progress-bar" style="overflow:inherit!important"><div class="nw-progress-text" style="margin-bottom: 3px">{{slText | translate}}</div><div class="nw-progress-band" style="{{sliderColor}}"></div></div><span ng-if="slShowDesc" class="note state_desc">{{slDesc | translate}}</span></span>',
        replace: !0,
        plain: !0,
        restrict: 'AE',
        scope: {
          slValue: '=',
          slText: '=',
          slMaxCount: '=',
          slDesc: '=',
          slShowDesc: '=',
        },
        link: function($scope) {
          var maxColorChannelValue = 215;
          $scope.$watch('slValue', function(value) {
            if (!value || value > $scope.slMaxCount) return "'inherit'";
            var seperateColor = '#FFF',
              blockCount = value,
              seperateCount = value - 1,
              sliderMaxCount = $scope.slMaxCount,
              gradientStep = 11 >= sliderMaxCount ? 2 : 0,
              gradientValue = 9 >= sliderMaxCount ? 100 : 120,
              percent = (100 - 2 * seperateCount) / blockCount,
              eachSlWidth = (100 - 2 * (sliderMaxCount - 1)) / sliderMaxCount,
              onuWidth = value * eachSlWidth + 2 * seperateCount,
              sumPercent = percent,
              bgColor = 'linear-gradient(to right, ',
              rgb =
                'rgb(' +
                maxColorChannelValue +
                ',' +
                (maxColorChannelValue -
                  parseInt(
                    (maxColorChannelValue * (gradientValue - 50)) / 50
                  )) +
                ',0)';
            bgColor +=
              1 == blockCount
                ? rgb + '0%, ' + rgb + '100%)'
                : rgb + ' ' + percent + '%, ';
            for (var i = 1; blockCount > i; i++)
              i <= parseInt(blockCount / 2)
                ? (rgb =
                    'rgb(' +
                    maxColorChannelValue +
                    ',' +
                    (maxColorChannelValue -
                      parseInt(
                        (maxColorChannelValue *
                          (gradientValue - 10 * (i + gradientStep) - 50)) /
                          50
                      )) +
                    ',0)')
                : i + 1 != blockCount
                  ? (rgb =
                      'rgb(' +
                      parseInt(
                        (maxColorChannelValue *
                          (gradientValue - 10 * (i + gradientStep))) /
                          50
                      ) +
                      ',' +
                      maxColorChannelValue +
                      ',0)')
                  : i + 1 == sliderMaxCount &&
                    (rgb =
                      'rgb(' +
                      parseInt((-1 * maxColorChannelValue) / 50) +
                      ',' +
                      maxColorChannelValue +
                      ',0)'),
                (bgColor +=
                  seperateColor +
                  ' ' +
                  sumPercent +
                  '%, ' +
                  seperateColor +
                  ' ' +
                  (sumPercent += 2) +
                  '%, ' +
                  rgb +
                  ' ' +
                  sumPercent +
                  '%, ' +
                  rgb +
                  ' ' +
                  (sumPercent += percent) +
                  '%'),
                (bgColor += i + 1 != blockCount ? ', ' : '');
            $scope.sliderColor =
              'width: ' + onuWidth + '%; background: ' + bgColor;
          });
        },
      };
    },
  ]);
})();
