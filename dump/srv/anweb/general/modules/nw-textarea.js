'use strict';
!(function() {
  var nw = angular.module(regdep('nw-textarea'), []);
  nw.directive('nwTextarea', [
    'translate',
    '$compile',
    function(translate, $compile) {
      return {
        restrict: 'A',
        replace: !0,
        scope: {
          nwModel: '=',
          nwLabel: '@',
          nwLabelStatusText: '@',
          nwLabelStatusValue: '@',
        },
        template:
          '<div class="div_textarea"><span class="label" ng-class="{ required: isRequired }"></span><span class="label {{ nwLabelStatusValue }}" ng-if="nwLabelStatusText">{{ nwLabelStatusText}}</span><textarea class="nw_textarea" ng-model="nwModel" ng-change="getChange(nwModel)"></textarea><span class=\'label\'></span><div class="nwfield_valid"><span ng-class="error" ng-show="isShowError()"></span></div></div>',
        link: function($scope, $element, $attr) {
          function getAdditionalInfo(value) {
            if (void 0 != $attr.nwTextareaSmsCount) {
              if (0 == value.length) return '';
              var smsCountStr = '',
                maxSmsLength = new RegExp('[А-яЁё]+', 'g').test(value)
                  ? 70
                  : 135;
              return (smsCountStr =
                ' (' + Math.floor(1 + value.length / maxSmsLength) + ' SMS)');
            }
            return '';
          }
          function getTextByteSize(value) {
            var textSize = 0,
              maxInx = 0;
            return (
              _.each(value, function(char, inx) {
                (textSize += getCharSize(char)),
                  textSize >= maxTextLength && (maxInx || (maxInx = inx));
              }),
              textSize
            );
          }
          function getCharSize(char) {
            var code = char.charCodeAt(0);
            return code >= 0 && 127 >= code
              ? 1
              : code >= 128 && 2047 >= code
                ? 2
                : code >= 2048 && 65535 >= code
                  ? 3
                  : code >= 65536 && 2097151 >= code
                    ? 4
                    : 1;
          }
          function checkTextareaRequired() {
            $scope.isRequired && isVisible(textarea[0])
              ? model.$setValidity(
                  'input_is_empty',
                  !isModelEmpty() || model.$pristine
                )
              : model.$setValidity('input_is_empty', !0);
          }
          function isModelEmpty() {
            return (
              _.isUndefined(model.$viewValue) ||
              _.isNaN(model.$viewValue) ||
              _.isNull(model.$viewValue) ||
              !model.$viewValue.toString().length
            );
          }
          function isVisible(dom) {
            return (
              dom &&
              'none' != dom.style.display &&
              dom.offsetWidth &&
              dom.offsetHeight
            );
          }
          function isFuncsAttr(attr) {
            return /\(.*\)$/.test(attr);
          }
          var maxTextLength,
            lastLength,
            countStr,
            simpleCountStr,
            textarea = $element.find('textarea'),
            label = $element.find('span').eq(0),
            textError = $element.find('span').eq(2),
            lengthError = !1;
          if (
            (($scope.isRequired = $scope.nwRequired || '' === $attr.nwRequired),
            $attr.nwLabel &&
              (isFuncsAttr($attr.nwLabel)
                ? label.attr('ng-bind', '' + $attr.nwLabel)
                : label.attr('ng-bind', "'" + $attr.nwLabel + "' | translate"),
              $compile(label)($scope)),
            textError.attr('ng-bind', "'messMoreThanMaxLength'| translate"),
            $compile(textError)($scope),
            $attr.nwTextareaPlaceholder &&
              textarea.attr(
                'placeholder',
                translate($attr.nwTextareaPlaceholder)
              ),
            $attr.nwTextareaMaxlength &&
              (maxTextLength = parseInt($attr.nwTextareaMaxlength)),
            void 0 != $attr.nwTextareaCount &&
              void 0 != $attr.nwTextareaMaxlength &&
              ((countStr = $element.find('span').eq(1)),
              countStr.attr(
                'ng-bind',
                "'" +
                  translate('voipTextMessCountLeft') +
                  ': {{' +
                  maxTextLength +
                  "}}' | translate"
              ),
              $compile(countStr)($scope)),
            void 0 != $attr.nwTextareaSimpleCount &&
              ((simpleCountStr = $element.find('span').eq(1)),
              simpleCountStr.attr(
                'ng-bind',
                "'" + translate('Введено символов') + ": {{0}}' | translate"
              ),
              $compile(simpleCountStr)($scope)),
            $attr.nwTextareaRows)
          )
            textarea.attr('rows', $attr.nwTextareaRows);
          else if ($attr.nwTextareaMaxlength) {
            var rowsCount = parseInt($attr.nwTextareaMaxlength / 100);
            textarea.attr('rows', 10 > rowsCount ? rowsCount : 10);
          } else textarea.attr('rows', 3);
          ($scope.getChange = function(value) {
            if (void 0 != $attr.nwTextareaSimpleCount) {
              if (!simpleCountStr) return;
              simpleCountStr.attr(
                'ng-bind',
                "'" +
                  translate('entededCharacters') +
                  ': {{' +
                  value.length +
                  '}}' +
                  getAdditionalInfo(value) +
                  "'"
              ),
                $compile(simpleCountStr)($scope);
            }
            if (void 0 != $attr.nwTextareaCount) {
              if (!countStr) return;
              var curLength = getTextByteSize(value);
              (lastLength = maxTextLength - curLength),
                (lengthError = 0 > lastLength ? !0 : !1),
                model.$setValidity('maxLength', !lengthError),
                countStr.attr(
                  'ng-bind',
                  "'" +
                    translate('voipTextMessCountLeft') +
                    ': {{' +
                    lastLength +
                    "}}' | translate"
                ),
                $compile(countStr)($scope);
            }
          }),
            ($scope.isShowError = function() {
              return lengthError;
            });
          var model = textarea.data('$ngModelController');
          model &&
            $scope.isRequired &&
            $scope.$watch('nwModel', checkTextareaRequired);
        },
      };
    },
  ]);
})();
