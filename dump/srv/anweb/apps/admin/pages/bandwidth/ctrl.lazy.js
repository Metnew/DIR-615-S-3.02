'use strict';
function _defineProperty(obj, key, value) {
  return (
    key in obj
      ? Object.defineProperty(obj, key, {
          value: value,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (obj[key] = value),
    obj
  );
}
!(function() {
  function BandwidthController(
    $scope,
    somovd,
    ngDialog,
    funcs,
    translate,
    snackbars
  ) {
    function activate(response) {
      ($scope.ports = response.data), $scope.$emit('pageload');
    }
    function pull() {
      somovd.read(CONFIG_ID_PORT_BANDWIDTH, activate);
    }
    var CONFIG_ID_PORT_BANDWIDTH = 230;
    ($scope.getPortRate = function(port) {
      return -1 == port.egress_bandwidth
        ? translate('bandwidth_unlimited')
        : port.egress_bandwidth;
    }),
      ($scope.getShort = function(port) {
        return (
          $scope.getPortRate(port) +
          ' ' +
          (-1 != port.egress_bandwidth ? $scope.getRateDimention() : '')
        );
      }),
      ($scope.getRateDimention = function() {
        return translate('size_Kb') + '/' + translate('second');
      }),
      ($scope.editBandwidth = function(portName, bandwidth) {
        var dlg = ngDialog.open({
          template: 'dialogs/bandwidth_edit/dialog.tpl.html',
          controller: 'BandwidthEditDialogController',
          resolve: funcs.getLazyResolve(
            'dialogs/bandwidth_edit/ctrl.lazy.js',
            'BandwidthEditDialogController'
          ),
          data: { portName: portName, bandwidth: bandwidth },
        });
        dlg.closePromise.then(function(result) {
          result &&
            result.value &&
            !_.isString(result.value) &&
            somovd.write(
              CONFIG_ID_PORT_BANDWIDTH,
              _defineProperty({}, portName, result.value),
              function(response) {
                return funcs.is.allRPCSuccess(response)
                  ? (snackbars.add('rpc_write_success'), void pull())
                  : void snackbars.add('rpc_write_error');
              }
            );
        });
      }),
      pull();
  }
  angular
    .module('app')
    .controllerProvider.register('BandwidthController', BandwidthController),
    (BandwidthController.$inject = [
      '$scope',
      'somovd',
      'ngDialog',
      'funcs',
      'translate',
      'snackbars',
    ]);
})();
