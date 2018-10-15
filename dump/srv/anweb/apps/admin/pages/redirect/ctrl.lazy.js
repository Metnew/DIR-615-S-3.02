'use strict';
angular.module('app').controllerProvider.register('RedirectCtrl', [
  '$scope',
  'somovd',
  'funcs',
  'snackbars',
  'redirectConstants',
  function($scope, somovd, funcs, snackbars, constants) {
    var rpc = 162,
      __backup = null;
    ($scope.modules = constants.CUSTOM_GOODLINE_21218
      ? ['cable', 'connections', 'configuring']
      : ['cable', 'factory', 'connections', 'configuring']),
      (function() {
        function initCallback(response) {
          ($scope.redirect = response.data),
            (__backup = angular.copy($scope.redirect)),
            $scope.$emit('pageload');
        }
        somovd.read(rpc, initCallback);
      })(),
      ($scope.apply = function() {
        function writeCb(response) {
          return funcs.is.allRPCSuccess(response)
            ? ((__backup = angular.copy($scope.redirect)),
              void snackbars.add('rpc_write_success'))
            : void snackbars.add('rpc_write_error');
        }
        somovd.write(rpc, $scope.redirect, writeCb);
      }),
      ($scope.wasModified = function() {
        return __backup && !_.isEqual(__backup, angular.copy($scope.redirect));
      });
  },
]);
