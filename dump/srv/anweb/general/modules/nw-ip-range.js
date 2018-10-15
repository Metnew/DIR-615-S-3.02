'use strict';
!(function() {
  function nwIpRange() {
    function controller($scope, $attrs, funcs) {
      function getChecker(version) {
        return 'ipv6' == version ? funcs.is.ipv6Network : funcs.is.ipv4Network;
      }
      $scope.ipRange = {
        rangeTypes: rangeTypes,
        type: getChecker($scope.nwIpRangeVersion)($scope.nwIpRange.begin)
          ? 'subnet'
          : 'range',
        endIpHidden: !1,
      };
    }
    var rangeTypes = [
      { value: 'range', name: 'ip_range_set_as_range' },
      { value: 'subnet', name: 'ip_range_set_as_subnet' },
    ];
    return {
      restrict: 'A',
      replace: !0,
      scope: {
        nwIpRange: '=',
        nwIpRangeVersion: '@',
        nwIpStartPlagin: '=',
        nwIpStartLabel: '@',
        nwIpStartDisabled: '=',
        nwIpStartRequired: '=',
        nwIpEndPlagin: '=',
        nwIpEndLabel: '@',
        nwIpEndDisabled: '=',
        nwIpEndRequired: '=',
        nwIpSubnetLabel: '@',
        nwRangeType: '=',
      },
      controller: controller,
      plain: !0,
      template:
        '<div>    <div nw-field nw-label="ip_range_set_as">        <select ng-model="ipRange.type" ng-options="item.value as item.name | translate for item in ipRange.rangeTypes">        </select>    </div>    <div nw-field        nw-label="{{ipRange.type != \'subnet\'? nwIpStartLabel: nwIpSubnetLabel}}"        nw-required="nwIpStartRequired"     >        <input type="text"            ng-model="nwIpRange.begin"            nw-ip-range-validation="startIp"            nw-ip-range-validation-version="{{nwIpRangeVersion}}"            nw-ip-range-validation-start-ip="nwIpRange.begin"            nw-ip-range-validation-end-ip="nwIpRange.end"            nw-ip-range-type="ipRange.type"            nw-client-list            nw-client-list-version="{{nwIpRangeVersion}}"        >    </div>    <div nw-field        nw-label="{{nwIpEndLabel}}"        ng-if="ipRange.type != \'subnet\'"        nw-required="nwIpEndRequired"     >        <input type="text"            ng-model="nwIpRange.end"            nw-ip-range-validation="endIp"            nw-ip-range-validation-version="{{nwIpRangeVersion}}"            nw-ip-range-validation-start-ip="nwIpRange.begin"            nw-ip-range-validation-end-ip="nwIpRange.end"            nw-ip-range-type="ipRange.type"            nw-client-list            nw-client-list-version="{{nwIpRangeVersion}}"        >    </div></div>',
    };
  }
  function nwIpRangeValidation(validation) {
    function link($scope, $element, $attrs, $ctrl) {
      function change(value) {
        return checkValidation(value), value;
      }
      function checkValidation(value) {
        var param = $scope.param,
          data = {
            version: $attrs.nwIpRangeValidationVersion,
            startIp: 'startIp' == param ? value : $scope.startIp,
            endIp: 'endIp' == param ? value : $scope.endIp,
            rangeType: $scope.rangeType,
          },
          error = validation(data)[param][0];
        (error || currentError) &&
          error != currentError &&
          ($ctrl.$setValidity(currentError, !0), (currentError = error)),
          error && $ctrl.$setValidity(error, !1);
      }
      var currentError = '';
      $attrs.$observe('nwIpRangeValidationVersion', function() {
        checkValidation($ctrl.$viewValue);
      }),
        'startIp' == $scope.param &&
          $scope.$watch('endIp', function() {
            checkValidation($ctrl.$viewValue);
          }),
        'endIp' == $scope.param &&
          $scope.$watch('startIp', function() {
            checkValidation($ctrl.$viewValue);
          });
      var endIpBackup = _.clone($scope.endIp);
      $scope.$watch('rangeType', function(value) {
        ($scope.rangeType = value),
          'subnet' == $scope.rangeType
            ? ((endIpBackup = _.clone($scope.endIp)), ($scope.endIp = null))
            : ($scope.endIp = endIpBackup),
          checkValidation($ctrl.$viewValue);
      }),
        $ctrl.$parsers.unshift(change),
        $ctrl.$formatters.unshift(change);
    }
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        param: '@nwIpRangeValidation',
        rangeType: '=nwIpRangeType',
        startIp: '=nwIpRangeValidationStartIp',
        endIp: '=nwIpRangeValidationEndIp',
      },
      link: link,
    };
  }
  function nwIpRangeCheckValidation(funcs) {
    function validation(data) {
      var errors = { startIp: [], endIp: [] };
      if (!data.version) return errors;
      var utils = ipVersionUtils[data.version];
      if (
        ('subnet' == data.rangeType &&
          data.startIp &&
          !utils.isIpNetwork(data.startIp) &&
          errors.startIp.push(utils.invalidSubnetMsg),
        'subnet' != data.rangeType &&
          data.startIp &&
          !utils.isIp(data.startIp) &&
          errors.startIp.push(utils.invalidIpMsg),
        'subnet' != data.rangeType &&
          data.endIp &&
          !utils.isIp(data.endIp) &&
          errors.endIp.push(utils.invalidIpMsg),
        'subnet' != data.rangeType &&
          data.startIp &&
          data.endIp &&
          utils.isIp(data.startIp) &&
          utils.isIp(data.endIp))
      ) {
        var compare = utils.compareAddress(data.startIp, data.endIp);
        switch (compare) {
          case 1:
            errors.startIp.push('error_start_ip_more_end_ip'),
              errors.endIp.push('error_end_ip_less_start_ip');
            break;
          case 0:
            errors.startIp.push('error_start_ip_equal_end_ip'),
              errors.endIp.push('error_start_ip_equal_end_ip');
        }
      }
      return errors;
    }
    var ipv4 = funcs.ipv4,
      ipv6 = funcs.ipv6,
      is = funcs.is,
      ipVersionUtils = {
        ipv4: {
          isIp: is.ipv4,
          isIpNetwork: is.ipv4Network,
          compareAddress: ipv4.address.compare,
          invalidIpMsg: 'invalid_ipv4',
          invalidSubnetMsg: 'invalid_ipv4_subnet',
        },
        ipv6: {
          isIp: is.ipv6,
          isIpNetwork: is.ipv6Network,
          compareAddress: ipv6.address ? ipv6.address.compare : function() {},
          invalidIpMsg: 'invalid_ipv6',
          invalidSubnetMsg: 'invalid_ipv6_subnet',
        },
      };
    return validation;
  }
  var nw = angular.module(regdep('nw-ip-range'), []);
  nw.directive('nwIpRange', [nwIpRange]),
    nw.directive('nwIpRangeValidation', [
      'nwIpRangeCheckValidation',
      nwIpRangeValidation,
    ]),
    nw.service('nwIpRangeCheckValidation', ['funcs', nwIpRangeCheckValidation]);
})();
