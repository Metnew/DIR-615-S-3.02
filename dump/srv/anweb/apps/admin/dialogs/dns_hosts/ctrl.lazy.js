'use strict';
function DnsHostsDialogCtrl($scope, somovd, funcs, snackbars) {
  function init() {
    (initModel = { host: funcs.deepClone(workModel.host) }),
      (workModel.isActivate = !0),
      $scope.$emit('pageload');
  }
  function save() {
    isFormValid() && $scope.closeThisDialog({ status: 'save', host: host });
  }
  function getUseIps() {
    return _.map(useIps, function(ip) {
      return { ip: ip };
    });
  }
  function validName(name) {
    return ~_.indexOf(useHostnames, name) ? 'error_value_is_not_uniq' : null;
  }
  function validIP(ip) {
    return ~_.indexOf(useIps, ip) ? 'error_value_is_not_uniq' : null;
  }
  function isSavingDisabled() {
    return !workModel.isNew && !wasModified();
  }
  function wasModified() {
    return workModel.isActivate && !_.isEqual(workModel.host, initModel.host);
  }
  function isFormValid() {
    return $scope.dialog_form.$valid;
  }
  var __default = { host: { ip: '', hostname: '' } },
    host = _.clone($scope.ngDialogData.host || __default.host),
    useHostnames =
      _.without($scope.ngDialogData.allHostnames, host.hostname) || [],
    useIps = _.without($scope.ngDialogData.allIps, host.ip) || [],
    initModel = null,
    workModel = {
      host: host,
      isNew: !$scope.ngDialogData.host,
      isActivate: !1,
    };
  (workModel.header = 'dnsHosts' + (workModel.isNew ? 'Add' : 'Edit')),
    ($scope.model = workModel),
    ($scope.funcs = {
      save: save,
      getUseIps: getUseIps,
      isSavingDisabled: isSavingDisabled,
    }),
    ($scope.valid = { name: validName, ip: validIP }),
    init();
}
angular
  .module('app')
  .controllerProvider.register('DnsHostsDialogCtrl', DnsHostsDialogCtrl);
