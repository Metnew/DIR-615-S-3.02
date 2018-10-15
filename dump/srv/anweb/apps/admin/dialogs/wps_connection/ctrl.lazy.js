'use strict';
!(function() {
  function WpsConnectionDialogController($scope, constants) {
    function connect() {
      $scope.wps_connection.$invalid || $scope.closeThisDialog($scope.wps);
    }
    function getSupportedConnectMethods() {
      var methods = [{ name: 'PBC', value: 'PBC' }];
      return (
        constants.USE_PIN_METHOD && methods.push({ name: 'PIN', value: 'PIN' }),
        methods
      );
    }
    function validationPIN(pin) {
      if (!pin) return null;
      if (
        ((pin = pin.replace(/(\-|\ )/g, '')),
        !new RegExp('^[0-9]+(.?[0-9]+|[0-9]*)$').test(pin))
      )
        return 'invalid_wpspin';
      if (4 != pin.length && 8 != pin.length) return 'invalid_wpspin';
      if (8 == pin.length) {
        var pin = parseInt(pin),
          accum = 0;
        if (
          ((accum += 3 * (parseInt(pin / 1e7) % 10)),
          (accum += 1 * (parseInt(pin / 1e6) % 10)),
          (accum += 3 * (parseInt(pin / 1e5) % 10)),
          (accum += 1 * (parseInt(pin / 1e4) % 10)),
          (accum += 3 * (parseInt(pin / 1e3) % 10)),
          (accum += 1 * (parseInt(pin / 100) % 10)),
          (accum += 3 * (parseInt(pin / 10) % 10)),
          (accum += 1 * (parseInt(pin / 1) % 10)),
          accum % 10 != 0)
        )
          return 'invalid_wpspin';
      }
      return null;
    }
    _.extend($scope, {
      connect: connect,
      validationPIN: validationPIN,
      getSupportedConnectMethods: getSupportedConnectMethods,
      wps: { method: 'PBC' },
    });
  }
  angular
    .module('app')
    .controllerProvider.register(
      'WpsConnectionDialogController',
      WpsConnectionDialogController
    ),
    (WpsConnectionDialogController.$inject = ['$scope', 'wifiWPSConstants']);
})();
