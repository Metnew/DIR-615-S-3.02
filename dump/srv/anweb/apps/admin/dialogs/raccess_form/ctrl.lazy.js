'use strict';
angular
  .module('app')
  .controllerProvider.register('RemoteAccessDialogCtrl', function(
    $scope,
    somovd,
    translate,
    funcs,
    snackbars
  ) {
    function createBackup(rule) {
      return angular.copy({
        ips: rule.ips,
        source_mask: rule.source_mask,
        sport: rule.sport,
      });
    }
    function isFormValid() {
      function emptyFields() {
        return requiredFields.some(function(field) {
          return !$scope.rule[field];
        });
      }
      function isUniqRule(pos) {
        return $scope.rules && $scope.rules[pos]
          ? !angular.equals($scope.rule, $scope.rules[pos])
          : !0;
      }
      var requiredFields = [],
        isIPv6 = 'ipv6' === $scope.ipVersion.value;
      return (
        $scope.enableAll || requiredFields.push('ips'),
        $scope.enableAll || isIPv6 || requiredFields.push('source_mask'),
        isIPv6 || requiredFields.push('sport'),
        $scope.defined.bcm_rlx_ralink && requiredFields.push('name'),
        isUniqRule(pos) && !$scope.raccess_form.$invalid && !emptyFields()
      );
    }
    function checkData() {
      function checkUniq(rule) {
        return keys.every(checkEqual(rule));
      }
      function checkEqual(rule) {
        return function(key) {
          return 'iface' !== key || 'auto' !== $scope.rule.iface || rule.iface
            ? rule[key] == $scope.rule[key]
            : !0;
        };
      }
      function checkPortServices(rule) {
        return rule.dport == $scope.rule.dport
          ? !1
          : rule.sport == $scope.rule.sport
            ? !0
            : !1;
      }
      if (!isFormValid()) return !1;
      var keys = Object.keys($scope.rule);
      return $scope.rules &&
        _.without($scope.rules, $scope.rules[pos]).some(checkUniq)
        ? (snackbars.add('raccess_rule_exists'), !1)
        : ~$scope.busyPorts.indexOf(rule.sport)
          ? (snackbars.add('raccess_port_busy'), !1)
          : ~$scope.systemPorts.indexOf(rule.sport)
            ? (snackbars.add('raccess_system_port_busy'), !1)
            : $scope.rules &&
              _.without($scope.rules, $scope.rules[pos]).some(checkPortServices)
              ? (snackbars.add('raccess_port_busy_another_protocol'), !1)
              : !0;
    }
    function isEnableAll(rule) {
      return (
        ('::' === rule.ips && '' === rule.source_mask) ||
        ('0.0.0.0' === rule.ips && '0.0.0.0' === rule.source_mask)
      );
    }
    var pos = $scope.ngDialogData.pos,
      rule = ($scope.rule = angular.copy($scope.ngDialogData.rule)),
      backupStorage = {
        disabled: { ipv4: {}, ipv6: { source_mask: '', sport: '80' } },
        enabled: {
          ipv4: { ips: '0.0.0.0', source_mask: '0.0.0.0' },
          ipv6: { ips: '::', source_mask: '', sport: '80' },
        },
      };
    ($scope.ipVersion = {
      list: ['ipv4', 'ipv6'],
      value: rule.ipv6 ? 'ipv6' : 'ipv4',
    }),
      ($scope.enableAll = isEnableAll(rule)),
      ($scope.header =
        'raccess_' + ($scope.ngDialogData.isNew ? 'add' : 'edit')),
      rule.sport || (rule.sport = $scope.protocols[0].value),
      rule.dport || (rule.dport = $scope.protocols[0].value);
    var __backupRule = angular.copy(rule);
    ($scope.changeProtocol = function(dport) {
      rule.sport = angular.copy(dport);
    }),
      $scope.$watch(
        'ipVersion.value',
        function(value, oldValue) {
          if (value != oldValue) {
            var newVersion = value,
              oldVersion = oldValue,
              backup = $scope.enableAll
                ? backupStorage.enabled
                : backupStorage.disabled;
            (rule.ipv6 = 'ipv6' == newVersion),
              oldVersion && (backup[oldVersion] = createBackup(rule)),
              newVersion &&
                backup[newVersion] &&
                ((rule.ips = angular.copy(backup[newVersion].ips)),
                (rule.source_mask = angular.copy(
                  backup[newVersion].source_mask
                )),
                $scope.changeProtocol(rule.dport || backup[newVersion].sport));
          }
        },
        !0
      ),
      $scope.$watch(
        'enableAll',
        function(value, oldValue) {
          if (value != oldValue) {
            var oldBackup = value
                ? backupStorage.disabled
                : backupStorage.enabled,
              newBackup = value
                ? backupStorage.enabled
                : backupStorage.disabled,
              version = $scope.ipVersion.value;
            (oldBackup[version] = createBackup(rule)),
              newBackup[version] &&
                ((rule.ips = angular.copy(newBackup[version].ips)),
                (rule.source_mask = angular.copy(
                  newBackup[version].source_mask
                )));
          }
        },
        !0
      ),
      ($scope.save = function() {
        function writeCb(response) {
          return funcs.is.allRPCSuccess(response)
            ? (snackbars.add('rpc_write_success'),
              void $scope.closeThisDialog('saved'))
            : void snackbars.add('rpc_write_error');
        }
        checkData() &&
          ((rule.sport = rule.sport.toString()),
          (rule.dport = rule.dport.toString()),
          somovd.write(16, rule, pos, writeCb));
      }),
      ($scope.isSavingDisabled = function() {
        return _.isEqual($scope.rule, __backupRule);
      });
  });
