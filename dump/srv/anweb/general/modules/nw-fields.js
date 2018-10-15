'use strict';
!(function() {
  var nw = angular.module(regdep('nw-fields'), []);
  nw.directive('nwForm', function($document, $timeout) {
    return {
      restrict: 'A',
      require: 'form',
      link: function(scope, element, attrs, formCtrl) {
        function submitHandler() {
          _.each(element[0], function(el) {
            var $el = angular.element(el),
              model = $el.data('$ngModelController'),
              isField = model && model.hasOwnProperty('$viewValue');
            isField && !el.disabled && model.$setViewValue(model.$viewValue),
              isAutocompleteOff &&
                'password' == $el.attr('type') &&
                setInputAutocompleteOff($el);
          }),
            scope.$digest(),
            element.addClass('nw-form-apply');
          var invalid = element[0].querySelector('.ng-invalid:enabled');
          invalid &&
            ('scrollToElementAnimated' in $document
              ? $document.scrollToElementAnimated(invalid, 90)
              : invalid.scrollIntoView(!0)),
            formCtrl.$valid && formCtrl.$setPristine();
        }
        function isEqualPasswords() {
          _.each(element[0], function(el) {
            var $el = angular.element(el),
              nwConfirm = ($el.data('$ngModelController'),
              $el.attr('nw-confirm'));
            if (nwConfirm) {
              var passElement = formCtrl[nwConfirm],
                confElement = formCtrl[$el.attr('name')];
              passElement &&
              '' != confElement.$modelValue &&
              passElement.$valid &&
              confElement.$dirty &&
              passElement.$modelValue != confElement.$modelValue
                ? confElement.$setValidity('passwords_not_equal', !1)
                : confElement.$setValidity('passwords_not_equal', !0);
            }
          });
        }
        function setFormAutocompleteOff() {
          element.attr('autocomplete', 'off');
          var $fakePassword = angular.element(
            "<div><input/><input type='password' id='prevent_autofill' /></div>"
          );
          $fakePassword.css({
            overflow: 'hidden',
            width: '0px',
            height: '0px',
          }),
            element.prepend($fakePassword);
        }
        function setInputAutocompleteOff($el) {
          $el.attr('autocomplete', 'off');
        }
        var isAutocompleteOff = _.has(attrs, 'nwFormAutocompleteOff');
        isAutocompleteOff && setFormAutocompleteOff(),
          element.on('submit', function() {
            submitHandler();
          }),
          scope.$on('formSubmit', function() {
            $timeout(function() {
              submitHandler();
            }, 0);
          }),
          scope.$on('goToErrorForm', function(event, data) {
            data && submitHandler();
          }),
          scope.$on('resetErrorForm', function(event, data) {
            data && element.removeClass('nw-form-apply');
          }),
          scope.$watchCollection(
            '[config.user.confirm, config.user.password]',
            function() {
              isEqualPasswords();
            }
          );
      },
    };
  }),
    nw.directive('nwField', [
      'translate',
      '$timeout',
      '$compile',
      'fieldConfig',
      function(translate, $timeout, $compile, fieldConfig) {
        var template,
          replace = 'material' === fieldConfig.style ? !0 : !1;
        return (
          'material' == fieldConfig.style
            ? (template =
                '<label class="nwfield_element"ng-class="{ nwfield_required_error: error == \'input_is_empty\', invalid: error}"><div class="nwfield_content"><div ng-transclude></div></div><div class="nwfield_valid"><span ng-bind="error | translate" ng-show="isShowError()"></span></div></label>')
            : 'classic' == fieldConfig.style &&
              (template =
                '<div class="nwfield_element" ng-class="{ nwfield_required_error: error == \'input_is_empty\'}"><div class="nwfield_label" ng-class="{\'nwfield_label_disabled\': isDisabled}"><span ng-bind="nwLabel | translate"></span><span class="sep">:</span><font color="red" ng-show="isRequired && !isDisabled">*</font></div><div class="nwfield_content"><div ng-transclude></div></div><div class="nwfield_valid"><span ng-bind="error | translate" ng-show="isShowError()"></span></div></div>'),
          {
            restrict: 'A',
            replace: replace,
            transclude: !0,
            scope: {
              nwLabel: '@',
              nwLabelCompile: '=',
              nwRequired: '=',
              nwDisabled: '=',
            },
            template: template,
            link: function($scope, $element, $attr) {
              function attach(input, parentClass) {
                function isVisible(dom) {
                  return (
                    dom &&
                    'none' != dom.style.display &&
                    dom.offsetWidth &&
                    dom.offsetHeight
                  );
                }
                function requiredDisabledWatchExpr() {
                  return JSON.stringify([
                    model.$viewValue,
                    model.$dirty,
                    $scope.nwRequired,
                    $scope.revalidate,
                    $scope.nwDisabled,
                    $scope.nwInputDisabled,
                  ]);
                }
                function requiredDisabledListener() {
                  ($scope.isRequired =
                    $scope.nwRequired || '' === $attr.nwRequired),
                    ($scope.isDisabled =
                      $scope.nwDisabled ||
                      '' === $attr.nwDisabled ||
                      $scope.nwInputDisabled),
                    ($scope.isFieldEmpty = isEmptyField()),
                    checkRequired(),
                    checkDisabled();
                }
                function checkRequired() {
                  $scope.isRequired && isVisible($element[0])
                    ? model.$setValidity(
                        'input_is_empty',
                        !isModelEmpty() || model.$pristine
                      )
                    : model.$setValidity('input_is_empty', !0);
                }
                function isEmptyField() {
                  return (
                    !selects.length &&
                    !(model.$viewValue || 0 === model.$viewValue)
                  );
                }
                function isModelEmpty() {
                  return (
                    _.isUndefined(model.$viewValue) ||
                    _.isNaN(model.$viewValue) ||
                    _.isNull(model.$viewValue) ||
                    !model.$viewValue.toString().length
                  );
                }
                function checkDisabled() {
                  if ($scope.isDisabled && isVisible($element[0])) {
                    if (
                      input.parent().hasClass('nweye_wrapper') &&
                      input
                        .parent()
                        .find('i')
                        .hasClass('nweye_button')
                    ) {
                      var eye = input.parent().find('i');
                      input.prop('type', 'password'),
                        eye.removeClass('nweye_button'),
                        eye.addClass('nweye_close_button');
                    }
                    input.attr('disabled', 'disabled');
                  } else input.removeAttr('disabled');
                }
                if ('material' == fieldConfig.style) {
                  var labelAttr = function() {
                      return $scope.nwLabelCompile
                        ? 'nw-bind-html-compile'
                        : 'ng-bind';
                    },
                    label = $compile(
                      '<div class="nwfield_label" ng-class="{\'nwfield_label_disabled\': isDisabled}"><span ' +
                        labelAttr() +
                        '="nwLabel | translate" class="label"ng-class="{ required: isRequired && !isDisabled, placeholder: isFieldEmpty}"></span></div>'
                    )($scope);
                  input.after(label);
                }
                var model = input.data('$ngModelController');
                model &&
                  (parentClass && input.parent().addClass(parentClass),
                  $scope.$watch(
                    function() {
                      return JSON.stringify([
                        model.$error,
                        input.prop('disabled'),
                        isVisible(input[0]),
                      ]);
                    },
                    function(valid) {
                      if (
                        (($scope.error = ''),
                        input.prop('disabled') || !isVisible(input[0]))
                      )
                        for (var i in model.$error) model.$setValidity(i, !0);
                      else {
                        for (var i in model.$error)
                          if (model.$error[i]) {
                            if ('value_less_min' == i) {
                              i = translate(i);
                              var min = input.attr('nw-min');
                              _.isUndefined(min) || (i += ' (' + min + ')');
                            }
                            if ('value_more_max' == i) {
                              i = translate(i);
                              var max = input.attr('nw-max');
                              _.isUndefined(max) || (i += ' (' + max + ')');
                            }
                            if ('maxlength' == i) {
                              i = translate(i + '_symb');
                              var max = input.attr('ng-maxlength');
                              _.isUndefined(max) || (i += ' ' + max);
                            }
                            $scope.error = i;
                          }
                        model.$dirty &&
                          model.$viewValue &&
                          (model.$setViewValue(model.$viewValue),
                          model.$render());
                      }
                    }
                  ),
                  $scope.$watch(
                    requiredDisabledWatchExpr,
                    requiredDisabledListener
                  ),
                  $timeout(function() {
                    $scope.revalidate = !0;
                  }, 200));
              }
              function isInputDisabled() {
                input.attr('nw-input-disabled');
                return 'disabled' == input.attr('nw-input-disabled');
              }
              var input = $element.find('input'),
                selects = $element.find('select');
              if (input.length || selects.length) {
                if (input.length) {
                  var $input = angular.element(input),
                    input_watches = _.filter(input, function(i) {
                      return !_.isUndefined(
                        angular.element(i).attr('nw-validate')
                      );
                    });
                  0 == input_watches.length && (input_watches = input),
                    _.each(input_watches, function(i) {
                      attach(angular.element(i));
                    }),
                    $input.bind('focus', function() {
                      ($scope.elementFocus = !0), $scope.$apply();
                    }),
                    $input.bind('blur', function() {
                      ($scope.elementFocus = !1), $scope.$apply();
                    });
                }
                if (selects.length) {
                  var $selects = angular.element(selects);
                  _.each(selects, function(select) {
                    attach(angular.element(select), 'custom-select');
                  }),
                    $selects.bind('focus', function() {
                      ($scope.elementFocus = !0), $scope.$apply();
                    }),
                    $selects.bind('blur', function() {
                      ($scope.elementFocus = !1), $scope.$apply();
                    });
                }
                ($scope.isShowError = function() {
                  return !$scope.elementFocus && $scope.error;
                }),
                  $scope.$watch(isInputDisabled, function(value) {
                    $scope.nwInputDisabled = value;
                  });
              }
            },
          }
        );
      },
    ]),
    nw.directive('nwFieldGroup', [
      function() {
        var link = function($scope, $element, $attrs) {
          function setChildrenClass() {
            var $children = $element.children();
            $children.addClass('nwfield_group_element'),
              1 == $children.length &&
                $children.addClass('nwfield_group_element--c12'),
              2 == $children.length &&
                $children.addClass('nwfield_group_element--c6');
          }
          function changeChildrenElement() {
            return $element.children().length;
          }
          $element.addClass('nwfield_group'),
            $element.addClass('clearfix'),
            $scope.$watch(changeChildrenElement, setChildrenClass);
        };
        return { restrict: 'A', link: link };
      },
    ]),
    nw.directive('nwEyeText', [
      function() {
        return {
          restrict: 'A',
          link: function($scope, $element, $attrs) {
            for (
              var text = $attrs.nwEyeText, hidden = '', i = 0;
              i < _.size(text);
              i++
            )
              hidden += '*';
            var $value = angular.element('<span></span>'),
              $btn = angular.element(
                '<i class="nweye_close_button text noselect"></i>'
              );
            $element.prepend($value),
              $element.prepend($btn),
              $btn.bind('mousedown touchstart', function(event) {
                $value.text() == hidden
                  ? ($value.text(text),
                    $btn.removeClass('nweye_close_button'),
                    $btn.addClass('nweye_button'))
                  : ($value.text(hidden),
                    $btn.removeClass('nweye_button'),
                    $btn.addClass('nweye_close_button'));
              }),
              $value.text(hidden);
          },
        };
      },
    ]),
    nw.directive('nwEye', [
      function() {
        return {
          restrict: 'A',
          link: function($scope, $element, $attrs) {
            function isDisabled() {
              return $element.prop('disabled');
            }
            var $parent = $element.parent(),
              $btn = angular.element(
                '<i class="nweye_close_button noselect"></i>'
              );
            $parent.addClass('nweye_wrapper'),
              $parent.prepend($btn),
              $btn.bind('mousedown touchstart', function(event) {
                'password' == $element.prop('type')
                  ? ($element.prop('type', 'text'),
                    $btn.removeClass('nweye_close_button'),
                    $btn.addClass('nweye_button'))
                  : ($element.prop('type', 'password'),
                    $btn.removeClass('nweye_button'),
                    $btn.addClass('nweye_close_button')),
                  event.preventDefault();
              }),
              $scope.$watch(isDisabled, function(disabled) {
                disabled
                  ? $btn.css('display', 'none')
                  : $btn.css('display', 'block');
              }),
              $scope.$on('$destroy', function() {
                $parent.removeClass('nweye_wrapper'), $btn.unbind('mousedown');
              });
          },
        };
      },
    ]),
    nw.directive('nwCustomValid', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: { validation: '&nwCustomValid' },
        link: function($scope, $element, $attrs, $model) {
          function checkError() {
            var params = {},
              args = $scope.args;
            return _.isUndefined($model.$modelValue)
              ? null
              : ($scope.args &&
                  $scope.args[0] &&
                  (params[args[0]] = $model.$modelValue),
                $scope.validation(params));
          }
          function updateValidation(error) {
            if (
              (_.isNull(error) || ($scope.validationType = error),
              $scope.validationType)
            ) {
              var isError = _.isNull(error);
              $model.$setValidity($scope.validationType, isError);
            }
          }
          function updateValidationType(newType, oldType) {
            newType &&
              oldType &&
              newType != oldType &&
              $model.$setValidity(oldType, !0);
          }
          $scope.validationType,
            ($scope.args = []),
            ($scope.parseAttrs = function() {
              var reg = /\((.*)\)/,
                attr = $attrs.nwCustomValid,
                matches = attr.match(reg);
              matches &&
                matches.length &&
                matches[1] &&
                ($scope.args = matches[1].replace(/\s/g, '').split(','));
            }),
            $scope.parseAttrs(),
            $scope.$watch(checkError, updateValidation),
            $scope.$watch(
              function() {
                return (
                  'none' != $element[0].style.display &&
                  $element[0].offsetWidth &&
                  $element[0].offsetHeight
                );
              },
              function(visible) {
                visible &&
                  String($model.$modelValue).length &&
                  updateValidation(checkError());
              }
            ),
            $scope.$watch('validationType', updateValidationType);
        },
      };
    }),
    nw.directive('nwMinvalue', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, $element, $attrs, $model) {
          var isValid = function(s) {
            return !_.isFinite(s) || parseInt(s) >= parseInt($attrs.nwMinvalue);
          };
          $model.$parsers.unshift(function(viewValue) {
            return (
              $model.$setValidity('value_less_min', isValid(viewValue)),
              viewValue
            );
          }),
            $model.$formatters.unshift(function(modelValue) {
              return (
                $model.$setValidity('value_less_min', isValid(modelValue)),
                modelValue
              );
            }),
            $element.attr('min', $attrs.nwMinvalue);
        },
      };
    }),
    nw.directive('nwMaxvalue', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, $element, $attrs, $model) {
          var isValid = function(s) {
            return !_.isFinite(s) || parseInt(s) <= parseInt($attrs.nwMaxvalue);
          };
          $model.$parsers.unshift(function(viewValue) {
            return (
              $model.$setValidity('value_more_max', isValid(viewValue)),
              viewValue
            );
          }),
            $model.$formatters.unshift(function(modelValue) {
              return (
                $model.$setValidity('value_more_max', isValid(modelValue)),
                modelValue
              );
            }),
            $element.attr('max', $attrs.nwMaxvalue);
        },
      };
    }),
    nw.directive('nwNumber', function() {
      function link($scope, $el, $attrs, $model) {
        function parser(value) {
          if (skipCheckNumberValidation()) return prepareValidValue(value);
          _.each(validators, function(validator) {
            if (_.isEmpty(value) || _.isUndefined(value) || $attrs.disabled)
              return $model.$setValidity(validator.error, !0), !0;
            var result = validator.validate(value);
            return $model.$setValidity(validator.error, result), result;
          });
          var isValid = $model.$valid;
          return (value =
            isValid && _.isFinite(parseInt(value))
              ? 'string' == $attrs.nwNumberType
                ? value.toString()
                : parseInt(value)
              : 'string' == $attrs.nwNumberType
                ? ''
                : void 0);
        }
        function getValue(valueGetters) {
          return _.isFunction($scope[valueGetters.fn])
            ? $scope[valueGetters.fn]()
            : valueGetters.val;
        }
        function prepareValidValue(value) {
          return 'string' == $attrs.nwNumberType ? value : parseInt(value);
        }
        function skipCheckNumberValidation() {
          function getCurrentErrors() {
            var result = [];
            return $model && $model.$error
              ? (_.each($model.$error, function(value, name) {
                  value && result.push(name);
                }),
                result)
              : result;
          }
          if (!validators) return !0;
          var currentErrors = getCurrentErrors(),
            numberErrors = _.pluck(validators, 'error');
          return _.some(currentErrors, function(value) {
            return !_.contains(numberErrors, value);
          });
        }
        function checkFormat(value) {
          return patt_number.test(value) && _.isFinite(parseInt(value));
        }
        function checkMore(value) {
          return (
            !_.isFinite($scope.maxValue) ||
            parseInt(value) <= parseInt($scope.maxValue)
          );
        }
        function checkLess(value) {
          return (
            !_.isFinite($scope.minValue) ||
            parseInt(value) >= parseInt($scope.minValue)
          );
        }
        var validators = [];
        (_.has($attrs, 'nwMin') || _.has($attrs, 'nwMinFn')) &&
          validators.push({ validate: checkLess, error: 'value_less_min' }),
          (_.has($attrs, 'nwMax') || _.has($attrs, 'nwMaxFn')) &&
            validators.push({ validate: checkMore, error: 'value_more_max' }),
          validators.push({ validate: checkFormat, error: 'invalid_number' }),
          $model.$parsers.unshift(parser),
          $model.$formatters.unshift(parser);
        var min = getValue({ val: $attrs.nwMin, fn: $attrs.nwMinFn }),
          max = getValue({ val: $attrs.nwMax, fn: $attrs.nwMaxFn });
        min && ($scope.minValue = min),
          max && ($scope.maxValue = max),
          $attrs.$observe('nwMin', function(value) {
            _.isUndefined(value) || ($scope.minValue = min = parseInt(value));
          }),
          $attrs.$observe('nwMax', function(value) {
            _.isUndefined(value) || ($scope.maxValue = max = parseInt(value));
          });
      }
      var patt_number = /(^-?[0-9]+$)/;
      return { restrict: 'A', require: 'ngModel', link: link };
    }),
    nw.directive('nwMacNotNullAndNotMulticast', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, $element, $attrs, $model) {
          function isMac(mac) {
            var pattern = /^([0-9a-fA-F][0-9a-fA-F]:){5}[0-9a-fA-F][0-9a-fA-F]$/;
            return pattern.test(mac);
          }
          function isNullMac(mac) {
            var pattern = /^(00:){5}(00)$/;
            return pattern.test(mac);
          }
          function isMulticastMac(mac) {
            var pattern = /^[0-9a-fA-F][13579bBdDfF]:([0-9a-fA-F][0-9a-fA-F]:){4}[0-9a-fA-F][0-9a-fA-F]$/;
            return pattern.test(mac);
          }
          function unshiftFn(value) {
            return (
              _.isUndefined(value) ||
              !value.toString().length ||
              $attrs.disabled
                ? ($model.$setValidity('invalid_mac', !0),
                  $model.$setValidity('err_null_mac', !0),
                  $model.$setValidity('err_multicast_mac', !0))
                : ($model.$setValidity('invalid_mac', isMac(value)),
                  $model.$setValidity('err_null_mac', !isNullMac(value)),
                  $model.$setValidity(
                    'err_multicast_mac',
                    !isMulticastMac(value)
                  )),
              value
            );
          }
          $model.$parsers.unshift(unshiftFn),
            $model.$formatters.unshift(unshiftFn);
        },
      };
    }),
    nw.directive('nwType', function(funcs) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, $element, $attrs, $model) {
          function change(value) {
            var validator = validators[$attrs.nwType];
            if (validator)
              if (
                _.isUndefined(value) ||
                !value.toString().length ||
                $attrs.disabled
              )
                $model.$setValidity('invalid_' + $attrs.nwType, !0);
              else {
                var result = validator(value);
                $model.$setValidity('invalid_' + $attrs.nwType, result);
              }
            return (
              'number' == $attrs.nwType && (value = parseInt(value)), value
            );
          }
          var posInteger = function(value) {
              var patt = /^[0-9]$|^[1-9][0-9]*$/;
              return patt.test(value) ? !0 : !1;
            },
            isIpv4 = function(value) {
              var patt = /^0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.0*([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$/;
              return patt.test(value) ? !0 : !1;
            },
            checkMask = function(mask, version) {
              var arr = mask.split('.'),
                len = arr.length;
              switch (len) {
                case 1:
                  var endrange = '4' == version ? 32 : 128;
                  if (!checkMaskRange(arr[0], 0, endrange)) return !1;
                  break;
                case 4:
                  if (!isIpv4(mask) || ('4' != version && '46' != version))
                    return !1;
                  for (var bits = '', i = 0; 4 > i; i++) {
                    if (!posInteger(arr[i])) return !1;
                    var octet = parseInt(arr[i]);
                    (bits += 0 == octet ? '00000000' : octet.toString(2)), ype;
                  }
                  if (32 != bits.length) return !1;
                  var flagmask;
                  flagmask = '1' == bits.charAt(0) ? !1 : !0;
                  for (var j = 1; j <= bits.length; j++)
                    if (
                      (0 == bits.charAt(j) && (flagmask = !0),
                      1 == bits.charAt(j) && flagmask)
                    )
                      return !1;
                  break;
                default:
                  return !1;
              }
              return !0;
            },
            checkMaskRange = function(val, start_range, end_range) {
              return !_.isNaN(parseInt(val)) && posInteger(val)
                ? parseInt(val) < start_range || parseInt(val) > end_range
                  ? !1
                  : !0
                : !1;
            },
            validators = {
              ip: function(value) {
                return validators.ipv4(value) || validators.ipv6(value);
              },
              ipv4AddressOrSubnet: function(value) {
                return funcs.is.ipv4(value) || funcs.is.ipv4Network(value);
              },
              ipv4: function(value) {
                return isIpv4(value);
              },
              ipv6: function(value) {
                var patt = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
                if (_.isString(value)) {
                  var arrValue = value.split('/');
                  return arrValue.length <= 2 &&
                    (_.isUndefined(arrValue[0]) || patt.test(arrValue[0])) &&
                    (_.isUndefined(arrValue[1]) || checkMask(arrValue[1], '6'))
                    ? !0
                    : !1;
                }
                return !1;
              },
              mask: function(value) {
                return checkMask(value, '46');
              },
              maskv4: function(value) {
                return checkMask(value, '4');
              },
              maskv6: function(value) {
                return checkMask(value, '6');
              },
              prefixv6: function(value) {
                if (_.isUndefined(value)) return !1;
                var prefixInt = parseInt(value);
                return prefixInt >= 0 && 128 >= prefixInt;
              },
              url: function(value) {
                var patt = /^(?:(?:https?):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4])))|(?:(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
                return patt.test(value) ? !0 : !1;
              },
              number: function(value) {
                var patt_number = /(^-?[0-9]+$)/;
                return patt_number.test(value) ? !0 : !1;
              },
              domain: function(host) {
                var host = host || '',
                  regDomain = /^[а-яА-Яa-zA-Z0-9]+([\-]{0,2}[а-яА-Яa-zA-Z0-9])*$/;
                if (
                  ((host = host.replace(/(^\s+|\s+$)/g, '')), host.length > 255)
                )
                  return !1;
                var domains = host.split('.');
                for (var i in domains)
                  if (
                    domains[i].length < 1 ||
                    domains[i] > 63 ||
                    !regDomain.test(domains[i])
                  )
                    return !1;
                return !0;
              },
              host: function(_host) {
                return _host
                  ? validators.domain(_host) || validators.ipv4(_host)
                  : !0;
              },
              hostv6: function(host) {
                return host
                  ? validators.domain(host) || validators.ipv6(host)
                  : !0;
              },
              mac: function(value) {
                var patt_mac = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
                return patt_mac.test(value);
              },
              port: function(val) {
                var patt = /^[0-9]*$/;
                return (
                  val && (val = val.match(/\S+/)[0]), patt.test(val) ? !0 : !1
                );
              },
              pppPassword: function(str) {
                if (str) {
                  var patt = /[А-яёЁ]/;
                  if (patt.test(str)) return !1;
                }
                return !0;
              },
              notCyrillicChar: function(str) {
                var patt = /[АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя]+/g;
                return str ? !patt.test(str) : !0;
              },
              psk: function(str) {
                return !str || (str.length >= 8 && str.length <= 63) ? !0 : !1;
              },
              ploam: function(str) {
                if (str) {
                  var patt = /^\d{10}$/;
                  if (!patt.test(str)) return !1;
                }
                return !0;
              },
              mail: function(str) {
                var patt = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return str ? patt.test(str) : !0;
              },
              network_address_v4: function(value) {
                if (!funcs.is.ipv4(value) && !funcs.is.ipv4Network(value))
                  return !1;
                if (funcs.is.ipv4Network(value)) {
                  var ip = value.split('/')[0],
                    mask = value.split('/')[1],
                    net = funcs.ipv4.address.and(
                      ip,
                      funcs.ipv4.mask['long'](mask)
                    );
                  if (ip != net) return !1;
                }
                return !0;
              },
              network_address_v6: function(value) {
                if (!funcs.is.ipv6(value) && !funcs.is.ipv6Network(value))
                  return !1;
                if (funcs.is.ipv6Network(value)) {
                  var ip = value.split('/')[0],
                    prefix = value.split('/')[1] ? value.split('/')[1] : '128',
                    net = funcs.ipv6.subnet.getNetworkAddress(ip, prefix);
                  if (
                    funcs.ipv6.address.full(ip.toUpperCase()) !=
                    funcs.ipv6.address.full(net.toUpperCase())
                  )
                    return !1;
                }
                return !0;
              },
            };
          $model.$parsers.unshift(change), $model.$formatters.unshift(change);
        },
      };
    }),
    nw.directive('nwSelect', [
      function() {
        return {
          restrict: 'AEC',
          transclude: !0,
          scope: { nwSelect: '=', ngModel: '=' },
          template:
            '<div class="nwselect">	  <select ng-model="ngModel" ng-options="value.id as value.name group by value.group for value in nwSelect">	  </select></div>',
          controller: function($scope) {},
        };
      },
    ]),
    nw.directive('nwCheckbox', function(translate) {
      var link = function($scope, $element, $attrs) {
        function changeModelValue() {
          return $model.$modelValue;
        }
        function updateSwitchClass(value) {
          value
            ? $switch.addClass('nwcheckbox_switch--checked')
            : $switch.removeClass('nwcheckbox_switch--checked');
        }
        function updateViewValue(value) {
          $scope.$apply(function() {
            $model.$setViewValue(!$model.$modelValue);
          });
        }
        var $switch = angular.element($element.find('i')),
          $input = angular.element($element.find('input')),
          $model = $input.data('$ngModelController');
        $scope.$watch(changeModelValue, updateSwitchClass),
          $element.bind('click', updateViewValue);
      };
      return {
        restrict: 'A',
        replace: !0,
        transclude: !0,
        scope: { nwLabel: '@' },
        template:
          '<div class="nwcheckbox"><div ng-transclude></div><i class="nwcheckbox_switch"></i><span ng-if="nwLabel" class="nwcheckbox_label" ng-bind="nwLabel | translate"></span></div>',
        link: link,
      };
    }),
    nw.directive('nwRadio', function(translate) {
      var link = function($scope, $element, $attrs) {
        function isDisabled() {
          return $input.attr('disabled');
        }
        function changeModelValue() {
          return $model.$modelValue;
        }
        function updateSwitchClass(value) {
          value == $scope.nwValue
            ? $radio.addClass('nwradio_switch--checked')
            : $radio.removeClass('nwradio_switch--checked');
        }
        function updateStateClass() {
          isDisabled()
            ? $radio.addClass('nwradio_switch--disabled')
            : $radio.removeClass('nwradio_switch--disabled');
        }
        function updateViewValue() {
          isDisabled() ||
            $scope.$apply(function() {
              $model.$setViewValue($scope.nwValue);
            });
        }
        var $radio = angular.element($element.find('i')),
          $input = angular.element($element.find('input')),
          $model = $input.data('$ngModelController');
        $scope.$watch(changeModelValue, updateSwitchClass),
          $scope.$watch(isDisabled, updateStateClass),
          $element.bind('click', updateViewValue);
      };
      return {
        restrict: 'A',
        replace: !0,
        transclude: !0,
        scope: { nwLabel: '@', nwValue: '=' },
        template:
          '<div class="nwradio"><div ng-transclude></div><i class="nwradio_switch_outer"><i class="nwradio_switch_inner"></i></i><span ng-if="nwLabel" class="nwradio_label" ng-bind="nwLabel | translate"></span></div>',
        link: link,
      };
    }),
    nw.directive('nwRadioGroup', function() {
      function compile($element, $attrs) {
        var template = '';
        $attrs.nwLabel &&
          (template +=
            "<div class='label radio-group-label' ng-bind=\"'" +
            $attrs.nwLabel +
            '\' | translate" ></div>'),
          (template +=
            '<div ng-repeat="option in ' +
            $attrs.nwOptions +
            '"><div class="radio-field" nw-radio nw-label="{{option.label}}" nw-value="option.value"><input type="radio" ng-model="' +
            $attrs.nwModel +
            '" ng-change="' +
            $attrs.nwChange +
            '"></div></div>'),
          $element.append(template);
      }
      return { restrict: 'A', replace: !0, compile: compile };
    }),
    nw.directive('nwSwitch', [
      function() {
        return {
          restrict: 'AEC',
          scope: { nwSwitch: '=' },
          template:
            '<div class="nwswitch">                     <div class="container" ng-class="{onright: nwSwitch}">                        <div class="switch_button">                            </div></div>                        <div ng-click="change()" class="switch_touch">                    </div>                </div>',
          controller: function($scope) {
            $scope.change = function() {
              $scope.nwSwitch = !$scope.nwSwitch;
            };
          },
        };
      },
    ]),
    nw.directive('nwLabeledSwitch', [
      'translate',
      function(translate) {
        return {
          restrict: 'A',
          replace: !0,
          transclude: !0,
          template:
            '<label class="nw_labeled_switch switch"><input type="checkbox"><div class="thumb"><div class="track"></div></div><div class="label-wrapper"><span class="label"></span></div></label>',
          compile: function($element, $attr) {
            function isFuncsAttr(attr) {
              return /\(.*\)$/.test(attr);
            }
            var input = $element.find('input'),
              label = $element.find('span');
            $attr.nwLabel &&
              (isFuncsAttr($attr.nwLabel)
                ? label.attr('ng-bind', '' + $attr.nwLabel)
                : label.attr('ng-bind', "'" + $attr.nwLabel + "' | translate")),
              $attr.nwModel && input.attr('ng-model', $attr.nwModel),
              $attr.nwChange && input.attr('ng-change', $attr.nwChange),
              $attr.nwDisabled && input.attr('ng-disabled', $attr.nwDisabled);
          },
        };
      },
    ]);
})();
