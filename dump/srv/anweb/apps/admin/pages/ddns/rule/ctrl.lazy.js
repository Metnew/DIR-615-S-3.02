'use strict';
angular
  .module('app')
  .controllerProvider.register('DdnsRuleCtrl', function(
    $scope,
    $state,
    ddnsUtil,
    funcs,
    snackbars
  ) {
    function activate() {
      function __activate() {
        (helper = ddnsUtil.makeHelper()),
          (ddns = $scope.ddns = helper.getRule(pos)),
          ($scope.config = helper.getConfiguration()),
          ($scope.services = helper.getServices()),
          ($scope.tmp = { Service: helper.getCurrentService(ddns.Service) }),
          $scope.config.NeedChooseIface &&
            ($scope.ifaces = $scope.getAvailIfaces(ddns.Iface)),
          (__backupHostname = angular.copy(ddns.Hostname)),
          $scope.$emit('pageload');
      }
      return util.wasActivate()
        ? void __activate()
        : void util.pull().then(__activate);
    }
    function isFormValid() {
      function emptyFields() {
        return requiredFields.some(function(field) {
          return !$scope.ddns[field];
        });
      }
      var requiredFields = ['Hostname', 'Username', 'Password', 'Period'];
      return (
        ddns.NeedChooseIface && requiredFields.push('iface'),
        !$scope.ddns_form.$invalid && !emptyFields()
      );
    }
    var ddns,
      helper,
      util = ddnsUtil,
      currentState = $state.current.name.split('.');
    currentState.pop(), (currentState = currentState.join('.'));
    var __backupHostname = null,
      pos = _.isUndefined($state.params.inx)
        ? void 0
        : parseInt($state.params.inx);
    activate(),
      ($scope.addHost = function() {
        ddns.Hostname.push({ Name: '' }), ($scope.ddns.focus = !0);
      }),
      ($scope.removeHost = function(item, key) {
        ddns.Hostname.length > 1 && ddns.Hostname.splice(key, 1);
      }),
      ($scope.ddnsSave = function() {
        function success(response) {
          snackbars.add('rpc_write_success'), $state.go(currentState + '.info');
        }
        function error(response) {
          snackbars.add('rpc_write_error');
        }
        if (isFormValid()) {
          var overlay = $scope.overlay.circular,
            overlayId = overlay.start();
          (ddns.System = $scope.tmp.Service.System),
            (ddns.Service = $scope.tmp.Service.Service),
            (ddns.Ssl = $scope.tmp.Service.Ssl),
            (ddns.Period = ddns.Period),
            (ddns.Link = $scope.tmp.Service.Link),
            util
              .apply(ddns, pos)
              .then(success)
              ['catch'](error)
              ['finally'](overlay.stop.bind(overlay, overlayId));
        }
      }),
      ($scope.checkDomain = function(hostname) {
        return funcs.is.domain(hostname) ? null : 'invalid_domain';
      }),
      ($scope.isSavingDisabled = function() {
        return $scope.ddns_form
          ? __backupHostname &&
              _.isEqual(__backupHostname, angular.copy(ddns.Hostname)) &&
              $scope.ddns_form.$pristine
          : !0;
      });
  });
