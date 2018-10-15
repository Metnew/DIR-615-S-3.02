'use strict';
!(function() {
  function nwAutocompleteNetworkSubnetMask($compile, $timeout, funcs) {
    function link($scope, $element, $attrs, $ctrl) {
      function hasAutocomplete() {
        return (
          _.has($attrs, 'nwAutocomplete') &&
          _.has($attrs, 'nwAutocompleteOptions')
        );
      }
      function addAutocomplete() {
        $element.attr('nw-autocomplete', ''),
          $element.attr('nw-autocomplete-options', 'subnetMask.ranges'),
          $compile($element)($scope);
      }
      function correctRange(minHosts, maxHosts) {
        ($scope.subnetMask.ranges = getRanges()),
          _.isNumber(minHosts) && correctMinRange(minHosts),
          _.isNumber(maxHosts) && correctMaxRange(maxHosts);
      }
      function correctMinRange(hosts) {
        function findIndex(ranges, hosts) {
          for (var inx = ranges.length - 1; inx >= 0; inx--) {
            var current = ipv4.mask.hosts(ranges[inx].value);
            if (current >= hosts) return inx;
          }
          return null;
        }
        var ranges = $scope.subnetMask.ranges,
          index = findIndex(ranges, hosts);
        _.isNull(index) ||
          $scope.subnetMask.ranges.splice(index + 1, ranges.length - 1);
      }
      function correctMaxRange(hosts) {
        function findIndex(ranges, hosts) {
          for (var inx = 0; inx < ranges.length; inx++) {
            var current = ipv4.mask.hosts(ranges[inx].value);
            if (hosts >= current) return inx;
          }
          return null;
        }
        var ranges = $scope.subnetMask.ranges,
          index = findIndex(ranges, hosts);
        _.isNull(index) || $scope.subnetMask.ranges.splice(0, index);
      }
      function getDefaultValue() {
        function isEndAddress(ip) {
          return funcs.is.ipv4(ip) && '0' != ip.split('.')[3];
        }
        function getClassMask(ip) {
          var ipClass = funcs.ipv4.subnet.getNetworkClass(ip);
          switch (ipClass) {
            case 'A':
              return '255.0.0.0';
            case 'B':
              return '255.255.0.0';
            case 'C':
              return '255.255.255.0';
            case null:
              return '';
            default:
              return '255.255.255.0';
          }
        }
        var ip = $scope.subnetMask.ipAddress;
        return _.has($attrs, attr.useEndAddress) && isEndAddress(ip)
          ? '255.255.255.255'
          : getClassMask(ip);
      }
      hasAutocomplete() || addAutocomplete(),
        ($scope.subnetMask = {
          ipAddress: null,
          ranges: getRanges(),
          minHosts: 2,
          maxHosts: 16777214,
        }),
        correctMinRange($scope.subnetMask.minHosts),
        correctMaxRange($scope.subnetMask.maxHosts),
        $attrs.$observe(attr.minHosts, function(hosts) {
          _.isUndefined(hosts) ||
            ((hosts = parseInt(hosts)),
            ($scope.subnetMask.minHosts = hosts),
            correctRange(hosts, $scope.subnetMask.maxHosts));
        }),
        $attrs.$observe(attr.maxHosts, function(hosts) {
          _.isUndefined(hosts) ||
            ((hosts = parseInt(hosts)),
            ($scope.subnetMask.maxHosts = hosts),
            correctRange($scope.subnetMask.minHosts, hosts));
        }),
        $attrs.$observe(attr.ipAddress, function(ip) {
          $scope.subnetMask.ipAddress = ip ? ip : null;
        }),
        $element.bind('focus', function($event) {
          if (!$ctrl.$modelValue) {
            var value = getDefaultValue($scope.subnetMask.ipAddress);
            if (!value) return;
            $scope.$broadcast('autocomplete.stop'),
              $ctrl.$setViewValue(value),
              $ctrl.$render(),
              $scope.$apply(),
              $timeout(function() {
                $scope.$broadcast('autocomplete.start');
              }, 100);
          }
        });
    }
    function getRanges() {
      var start = '0.0.0.0',
        end = '255.255.255.255',
        ranges = ipv4.mask.range(start, end);
      return _.map(ranges, function(value) {
        return { title: value, value: value };
      });
    }
    var ipv4 = funcs.ipv4,
      attr = {
        ipAddress: 'nwAutocompleteNetworkIpAddressValue',
        minHosts: 'nwAutocompleteNetworkSubnetMaskMinHosts',
        maxHosts: 'nwAutocompleteNetworkSubnetMaskMaxHosts',
        useEndAddress: 'nwAutocompleteUseEndAddress',
      };
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  function nwAutocompleteNetworkGwip(funcs) {
    function link($scope, $element, $attrs, $ctrl) {
      function getDefaultValue() {
        var ip = $scope.gwip.ipAddress,
          mask = $scope.gwip.subnetMask;
        if (ip && funcs.is.ipv4(ip) && mask && funcs.is.mask(mask)) {
          var range = funcs.ipv4.subnet.getNetworkRange(ip, mask);
          return ip != range.start ? range.start : range.end;
        }
        return null;
      }
      ($scope.gwip = { ipAddress: null, subnetMask: null }),
        $attrs.$observe(attr.ipAddress, function(ip) {
          $scope.gwip.ipAddress = ip ? ip : null;
        }),
        $attrs.$observe(attr.subnetMask, function(mask) {
          $scope.gwip.subnetMask = mask ? mask : null;
        }),
        $element.bind('focus', function($event) {
          if (!$ctrl.$modelValue) {
            var value = getDefaultValue();
            if (!value) return;
            $ctrl.$setViewValue(value), $ctrl.$render(), $scope.$apply();
          }
        });
    }
    var attr = (funcs.ipv4,
    {
      ipAddress: 'nwAutocompleteNetworkIpAddressValue',
      subnetMask: 'nwAutocompleteNetworkSubnetMaskValue',
    });
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  function nwNetworkValidation(validation) {
    function link($scope, $element, $attrs, $ctrl) {
      function change(value) {
        return checkValidation(value), value;
      }
      function checkValidation(value) {
        var param = paramsMap[$scope.param],
          data = {};
        switch (((data[param] = value), param)) {
          case 'Address':
            data.SubnetMask = $attrs.nwNetworkValidationSubnetMaskValue;
            break;
          case 'SubnetMask':
            (data.Address = $scope.address),
              (data.SubnetMask = $scope.subnetMask);
          case 'GatewayIPAddress':
            (data.Address = $scope.address),
              (data.SubnetMask = $scope.subnetMask);
            break;
          case 'DNSServer1':
            data.DNSServer2 = $scope.dnsServer2;
            break;
          case 'DNSServer2':
            data.DNSServer1 = $scope.dnsServer1;
        }
        var only = {};
        only[param] = !0;
        var error = validation(data, only)[param];
        (error || currentError) &&
          error != currentError &&
          ($ctrl.$setValidity(currentError, !0), (currentError = error)),
          error && $ctrl.$setValidity(error, !1);
      }
      var paramsMap = {
          address: 'Address',
          subnetMask: 'SubnetMask',
          gwip: 'GatewayIPAddress',
          dnsServer1: 'DNSServer1',
          dnsServer2: 'DNSServer2',
        },
        currentError = '';
      'subnetMask' == $scope.param &&
        $scope.$watch('address', function() {
          checkValidation($ctrl.$viewValue);
        }),
        'subnetMask' == $scope.param &&
          $scope.$watch('subnetMask', function() {
            checkValidation($ctrl.$viewValue);
          }),
        'gwip' == $scope.param &&
          $scope.$watch('address', function() {
            checkValidation($ctrl.$viewValue);
          }),
        'gwip' == $scope.param &&
          $scope.$watch('subnetMask', function() {
            checkValidation($ctrl.$viewValue);
          }),
        'dnsServer1' == $scope.param &&
          $scope.$watch('dnsServer2', function() {
            checkValidation($ctrl.$viewValue);
          }),
        'dnsServer2' == $scope.param &&
          $scope.$watch('dnsServer1', function() {
            checkValidation($ctrl.$viewValue);
          }),
        $ctrl.$parsers.unshift(change),
        $ctrl.$formatters.unshift(change);
    }
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        param: '@nwNetworkValidation',
        address: '=nwNetworkAddress',
        subnetMask: '=nwNetworkSubnetMask',
        gwip: '=nwNetworkGatewayIpAddress',
        dnsServer1: '=nwNetworkDnsServerOne',
        dnsServer2: '=nwNetworkDnsServerTwo',
      },
      link: link,
    };
  }
  function nwNetworkCheckValidation(funcs) {
    function validation(obj, only) {
      function isNeed(name) {
        return !only || only[name];
      }
      function checkValidation(obj, param) {
        function isInvalidAddress(addr) {
          return addr && !is.ipv4(addr);
        }
        function isInvalidSubnetMask(msk) {
          return msk && !is.mask(msk);
        }
        function isReserved(addr, msk) {
          return addr && msk && funcs.ipv4.subnet.checkReserved(addr, msk);
        }
        function isInvalidGwip(gwip) {
          return gwip && !is.ipv4(gwip);
        }
        function isInvalidDns(dns) {
          return dns && !is.ipv4(dns);
        }
        function isNeedCustomCheck2KOM() {
          return 'undefined' != typeof BR2_PACKAGE_ANWEB_CUSTOM_2KOM_21535;
        }
        function checkGwipRangeValidation(obj) {
          function isGwifEqualAddress(addr, gwip) {
            return addr == gwip;
          }
          function gwipOutOfRange(obj) {
            var ranges = getRanges(obj.Address, obj.SubnetMask);
            return ranges.length
              ? !_.some(ranges, function(range) {
                  return ipv4.subnet.belongNetworkRange(
                    range,
                    obj.GatewayIPAddress
                  );
                })
              : !1;
          }
          function getRanges(addr, mask) {
            var ranges = [];
            return (
              addr &&
                mask &&
                ranges.push(ipv4.subnet.getNetworkRange(addr, mask)),
              ranges
            );
          }
          return !obj.GatewayIPAddress ||
            isInvalidAddress(obj.Address) ||
            isInvalidSubnetMask(obj.SubnetMask)
            ? ''
            : isGwifEqualAddress(obj.Address, obj.GatewayIPAddress)
              ? 'error_gateway_ip_address_reserved'
              : gwipOutOfRange(obj)
                ? 'error_gateway_ip_address_out_of_range'
                : '';
        }
        function checkDNSValidation(msk) {
          function dhsServersIsEqual(obj) {
            return (
              obj.DNSServer1 &&
              obj.DNSServer2 &&
              obj.DNSServer1 == obj.DNSServer2
            );
          }
          return dhsServersIsEqual(obj) ? 'error_dns_servers_is_equal' : '';
        }
        switch (param) {
          case 'Address':
            return isInvalidAddress(obj.Address)
              ? 'invalid_ipv4'
              : isReserved(obj.Address, obj.SubnetMask)
                ? 'error_ip_is_reserved'
                : isNeedCustomCheck2KOM() &&
                  obj.Address &&
                  !funcs.customValidation.validStaticIP_2KOM_21748(
                    obj.Address,
                    obj.SubnetMask
                  )
                  ? 'not_allowed_addr'
                  : '';
          case 'SubnetMask':
            return isInvalidSubnetMask(obj.SubnetMask)
              ? 'invalid_mask'
              : isNeedCustomCheck2KOM() &&
                obj.Address &&
                obj.SubnetMask &&
                funcs.customValidation.validStaticIP_2KOM_21748(
                  obj.Address,
                  obj.SubnetMask
                ) &&
                !funcs.customValidation.validSubnetMask_2KOM_21748(
                  obj.Address,
                  obj.SubnetMask
                )
                ? 'invalid_mask'
                : '';
          case 'GatewayIPAddress':
            return isInvalidGwip(obj.GatewayIPAddress)
              ? 'invalid_ipv4'
              : checkGwipRangeValidation(obj);
          case 'DNSServer1':
            if (isNeedCustomCheck2KOM())
              return funcs.customValidation.validDNS_2KOM_21748(obj.DNSServer1)
                ? checkDNSValidation(obj)
                : 'not_allowed_addr';
          case 'DNSServer2':
            if (isInvalidDns(obj[param])) return 'invalid_ipv4';
            if (isNeedCustomCheck2KOM()) {
              if (!funcs.customValidation.validDNS_2KOM_21748(obj.DNSServer2))
                return 'not_allowed_addr';
              if (
                !funcs.customValidation.validAllDNS_2KOM_21748(
                  obj.DNSServer1,
                  obj.DNSServer2
                )
              )
                return 'not_allowed_addr';
            }
            return checkDNSValidation(obj);
        }
        return errors;
      }
      var errors = {
        Address: '',
        SubnetMask: '',
        GatewayIPAddress: '',
        DNSServer1: '',
        DNSServer2: '',
      };
      return (
        isNeed('Address') && (errors.Address = checkValidation(obj, 'Address')),
        isNeed('SubnetMask') &&
          (errors.SubnetMask = checkValidation(obj, 'SubnetMask')),
        isNeed('GatewayIPAddress') &&
          (errors.GatewayIPAddress = checkValidation(obj, 'GatewayIPAddress')),
        isNeed('DNSServer1') &&
          (errors.DNSServer1 = checkValidation(obj, 'DNSServer1')),
        isNeed('DNSServer2') &&
          (errors.DNSServer2 = checkValidation(obj, 'DNSServer2')),
        errors
      );
    }
    {
      var is = funcs.is,
        ipv4 = funcs.ipv4;
      funcs.subnet;
    }
    return validation;
  }
  function nwStrictIpValidation(funcs) {
    function link($scope, $element, $attrs, $ctrl) {
      function validation(value) {
        if (funcs.is.ipv4(value)) {
          var is = _.some(reserved, function(range) {
            return funcs.ipv4.subnet.belongNetworkRange(range, value);
          });
          $ctrl.$setValidity('invalid_ipv4', !is);
        }
        return value;
      }
      $ctrl.$parsers.unshift(validation), $ctrl.$formatters.unshift(validation);
    }
    var reserved = [
      { start: '0.0.0.0', end: '0.255.255.255' },
      { start: '127.0.0.0', end: '127.255.255.255' },
      { start: '224.0.0.0', end: '239.255.255.255' },
      { start: '255.255.255.255', end: '255.255.255.255' },
    ];
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  function nwNetworkType(funcs) {
    function link($scope, $element, $attrs, $ctrl) {
      function validation(value) {
        var isValid =
          'ipv4' == version ? validationIpv4(value) : validationIpv6(value);
        return (
          isValid
            ? cleanValidError()
            : $ctrl.$setValidity('invalid_network_' + version, !1),
          value
        );
      }
      function validationIpv4(value) {
        if (!value) return !0;
        if (!funcs.is.ipv4Network(value)) return !1;
        var ip = value.split('/')[0],
          mask = value.split('/')[1],
          net = funcs.ipv4.address.and(ip, funcs.ipv4.mask['long'](mask));
        return ip != net ? !1 : !0;
      }
      function cleanValidError() {
        $ctrl.$setValidity('invalid_network_ipv4', !0),
          $ctrl.$setValidity('invalid_network_ipv6', !0);
      }
      var attr = { version: 'nwNetworkTypeVersion' },
        version = 'ipv4';
      $attrs.$observe(attr.version, function(value) {
        _.isUndefined(value) || ((version = value), cleanValidError());
      }),
        $ctrl.$parsers.unshift(validation),
        $ctrl.$formatters.unshift(validation);
    }
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  function nwIpExtType(funcs) {
    function link($scope, $element, $attrs, $ctrl) {
      function validation(value) {
        var isValid =
          'ipv4' == version ? validationIpv4(value) : validationIpv6(value);
        return (
          isValid
            ? cleanValidError()
            : $ctrl.$setValidity('invalid_' + version + '_ext', !1),
          value
        );
      }
      function validationIpv4(value) {
        if (!value) return !0;
        var arrVal = value.split('/'),
          ip = arrVal[0],
          mask = arrVal[1];
        return funcs.is.ipv4(ip)
          ? '' == mask
            ? !1
            : _.isUndefined(mask) || funcs.is.ipv4Prefix(mask)
              ? !0
              : !1
          : !1;
      }
      function cleanValidError() {
        $ctrl.$setValidity('invalid_ipv4_ext', !0),
          $ctrl.$setValidity('invalid_ipv6_ext', !0);
      }
      var attr = { version: 'nwIpExtTypeVersion' },
        version = 'ipv4';
      $attrs.$observe(attr.version, function(value) {
        _.isUndefined(value) || ((version = value), cleanValidError());
      }),
        $ctrl.$parsers.unshift(validation),
        $ctrl.$formatters.unshift(validation);
    }
    return { restrict: 'A', require: 'ngModel', link: link };
  }
  var nw = angular.module(regdep('nw-network'), []);
  nw.directive('nwAutocompleteNetworkSubnetMask', [
    '$compile',
    '$timeout',
    'funcs',
    nwAutocompleteNetworkSubnetMask,
  ]),
    nw.directive('nwAutocompleteNetworkGwip', [
      'funcs',
      nwAutocompleteNetworkGwip,
    ]),
    nw.directive('nwNetworkValidation', [
      'nwNetworkCheckValidation',
      nwNetworkValidation,
    ]),
    nw.factory('nwNetworkCheckValidation', ['funcs', nwNetworkCheckValidation]),
    nw.directive('nwStrictIpValidation', ['funcs', nwStrictIpValidation]),
    nw.directive('nwNetworkType', ['funcs', nwNetworkType]),
    nw.directive('nwIpExtType', ['funcs', nwIpExtType]);
})();
