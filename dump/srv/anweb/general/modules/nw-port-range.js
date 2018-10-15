'use strict';
!(function() {
  function nwPortRange() {
    function compile($element, $attrs) {
      function getPort($attrs, name) {
        var attrName = capitalizeFirstLetter(name),
          label = $attrs['nwPort' + attrName + 'Label'],
          model = $attrs['nwPort' + attrName + 'Model'],
          disabled = $attrs['nwPort' + attrName + 'Disabled'],
          required = $attrs['nwPort' + attrName + 'Required'],
          startModel = $attrs.nwPortStartModel,
          endModel = $attrs.nwPortEndModel,
          usePorts = $attrs.nwPortUsePorts,
          portTm = '';
        return (
          (portTm += '<div nw-field '),
          (portTm += 'nw-label="' + label + '" '),
          disabled && (portTm += 'nw-disabled="' + disabled + '" '),
          required && (portTm += 'nw-required="' + required + '" '),
          (portTm += '>'),
          (portTm += '<input type="text" '),
          model &&
            ((portTm += 'ng-model="' + model + '" '),
            (portTm += 'nw-port-range-validation="' + name + 'Port" '),
            (portTm +=
              'nw-port-range-validation-start-port="' + startModel + '" '),
            (portTm += 'nw-port-range-validation-end-port="' + endModel + '" '),
            usePorts &&
              (portTm +=
                'nw-port-range-validation-use-ports="' + usePorts + '" ')),
          (portTm += '/>'),
          (portTm += '</div>')
        );
      }
      function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      var template = '<div>';
      (template += getPort($attrs, 'start')),
        (template += getPort($attrs, 'end')),
        (template += '</div>'),
        $element.append(template);
    }
    return { restrict: 'A', replace: !0, compile: compile };
  }
  function nwPortRangeValidation(validation) {
    function link($scope, $element, $attrs, $ctrl) {
      function change(value) {
        return checkValidation(value), value;
      }
      function checkValidation(value) {
        var param = $scope.param,
          data = {
            startPort: 'startPort' == param ? value : $scope.startPort,
            endPort: 'endPort' == param ? value : $scope.endPort,
            usePorts: $scope.usePorts || [],
          },
          error = validation(data, param)[param][0];
        (error || currentError) &&
          error != currentError &&
          ($ctrl.$setValidity(currentError, !0), (currentError = error)),
          error && $ctrl.$setValidity(error, !1);
      }
      var currentError = '';
      'startPort' == $scope.param &&
        $scope.$watch('endPort', function() {
          checkValidation($ctrl.$viewValue);
        }),
        'endPort' == $scope.param &&
          $scope.$watch('startPort', function() {
            checkValidation($ctrl.$viewValue);
          }),
        $scope.$watch(
          'usePorts',
          function() {
            checkValidation($ctrl.$viewValue);
          },
          !0
        ),
        $ctrl.$parsers.unshift(change),
        $ctrl.$formatters.unshift(change);
    }
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        param: '@nwPortRangeValidation',
        startPort: '=nwPortRangeValidationStartPort',
        endPort: '=nwPortRangeValidationEndPort',
        usePorts: '=nwPortRangeValidationUsePorts',
      },
      link: link,
    };
  }
  function nwPortRangeCheckValidation(funcs) {
    function validation(data, param) {
      function isInvalidPort(port) {
        return port && !is.port(port);
      }
      function comparePorts(startPort, endPort) {
        return startPort && endPort
          ? parseInt(startPort) > parseInt(endPort)
            ? 1
            : parseInt(startPort) == parseInt(endPort)
              ? 0
              : -1
          : -1;
      }
      function isUsePorts(port, usePorts) {
        return port
          ? _.some(usePorts, function(elem) {
              var startPort = elem.startPort ? parseInt(elem.startPort) : null,
                endPort = elem.endPort ? parseInt(elem.endPort) : null,
                curPort = parseInt(port);
              return elem.startPort && elem.endPort
                ? curPort >= startPort && endPort >= curPort
                : elem.startPort
                  ? startPort == curPort
                  : elem.endPort
                    ? endPort == curPort
                    : !1;
            })
          : !1;
      }
      function isOverlapRange(startPort, endPort, usePorts) {
        return startPort && endPort
          ? _.some(usePorts, function(elem) {
              var elemStartPort = elem.startPort
                  ? parseInt(elem.startPort)
                  : null,
                elemEndPort = elem.endPort ? parseInt(elem.endPort) : null,
                curStartPort = parseInt(startPort),
                curEndPort = parseInt(endPort);
              return (
                (elemStartPort &&
                  elemStartPort > curStartPort &&
                  curEndPort > elemStartPort) ||
                (elemEndPort &&
                  elemEndPort > curStartPort &&
                  curEndPort > elemEndPort)
              );
            })
          : !1;
      }
      var errors = { startPort: [], endPort: [] };
      if (
        (isInvalidPort(data.startPort) && errors.startPort.push('invalid_port'),
        isInvalidPort(data.endPort) && errors.endPort.push('invalid_port'),
        !errors.startPort.length && !errors.endPort.length)
      ) {
        var compare = comparePorts(data.startPort, data.endPort);
        switch (compare) {
          case 1:
            errors.startPort.push('error_start_port_more_end_port'),
              errors.endPort.push('error_start_port_less_end_port');
            break;
          case 0:
            errors.startPort.push('error_start_port_equal_end_port'),
              errors.endPort.push('error_start_port_equal_end_port');
        }
        isUsePorts(data.startPort, data.usePorts) &&
          errors.startPort.push('error_port_is_busy'),
          isUsePorts(data.endPort, data.usePorts) &&
            errors.endPort.push('error_port_is_busy');
      }
      return (
        errors.startPort.length ||
          errors.endPort.length ||
          (isOverlapRange(data.startPort, data.endPort, data.usePorts) &&
            (errors.startPort.push('error_port_range_is_overlap'),
            errors.endPort.push('error_port_range_is_overlap'))),
        errors
      );
    }
    var is = funcs.is;
    return validation;
  }
  var nw = angular.module(regdep('nw-port-range'), []);
  nw.directive('nwPortRange', [nwPortRange]),
    nw.directive('nwPortRangeValidation', [
      'nwPortRangeCheckValidation',
      nwPortRangeValidation,
    ]),
    nw.service('nwPortRangeCheckValidation', [
      'funcs',
      nwPortRangeCheckValidation,
    ]);
})();
