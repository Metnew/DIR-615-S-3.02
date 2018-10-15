'use strict';
angular.module('app').controllerProvider.register('PortsCtrl', [
  '$scope',
  '$state',
  'translate',
  'ngDialog',
  'funcs',
  'PortSettingsUtil',
  function($scope, $state, translate, ngDialog, funcs, util) {
    function init() {
      function success() {
        (helper = util.makeHelper()),
          updatePorts(helper.getData()),
          isSubscribe ||
            ((isSubscribe = !0), util.subscribe(updatePorts, $scope)),
          $scope.$emit('pageload'),
          $scope.$watch('ports', function() {
            return $scope.ports;
          });
      }
      function updatePorts(data) {
        $scope.ports = data;
      }
      util
        .pull()
        .then(success)
        ['catch'](errorPull);
    }
    function errorPull() {
      $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
    }
    var helper,
      isSubscribe = !1;
    init(),
      ($scope.edit = function(port, name) {
        ngDialog
          .open({
            template: 'dialogs/port_settings/dialog.tpl.html',
            className: 'port_settings_dialog',
            controller: 'PortSettingsDialogCtrl',
            resolve: funcs.getLazyResolve(
              'dialogs/port_settings/ctrl.lazy.js',
              'PortSettingsDialogCtrl'
            ),
            data: { port: port },
            scope: $scope,
          })
          .closePromise.then(init);
      }),
      ($scope.getPortStatus = function(status) {
        return translate('portStatus' + status);
      }),
      ($scope.getFlowControl = function(port) {
        return 'Up' !== port.status || 'Unknown' === port.flowControl
          ? '-'
          : 'Off' == port.flowControl
            ? translate('portStatusOff')
            : port.flowControl;
      }),
      ($scope.getSpeed = function(port) {
        return 'Up' !== port.status ? '-' : port.speed;
      }),
      ($scope.getShort = function(port) {
        return (
          '<div class="status ' +
          port.status +
          '">' +
          $scope.getPortStatus(port.status) +
          '</div>'
        );
      });
  },
]);
