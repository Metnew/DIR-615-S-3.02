'use strict';
!(function() {
  function lanCtrl($scope, $state, $q, helper) {
    function activate() {
      fetch().then(function() {
        lan['interface'].init(),
          ($scope.lan.data = lan.data()),
          ($scope.lan.interfaceCount = _.size($scope.lan.data)),
          ($scope.lan.isPageLoad = !0),
          $scope.$emit('pageload', { title: 'LAN' });
      });
    }
    function fetch() {
      function success() {
        deferred.resolve();
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' }),
          deferred.reject();
      }
      var deferred = $q.defer();
      return pull().then(success, error), deferred.promise;
    }
    function pull() {
      var deferred = $q.defer();
      return (
        lan.pull(function(error) {
          return error ? void deferred.reject('pull') : void deferred.resolve();
        }, supported),
        deferred.promise
      );
    }
    var lan = ($scope.device, $scope.device.lan),
      supported = helper.supported.lan();
    ($scope.lan = { data: null, interfaceCount: 0 }),
      ($scope.lan.isPageLoad = !1),
      $scope.$on('$destroy', function() {
        lan['interface'].clean();
      }),
      activate();
  }
  angular
    .module('app')
    .controller('lanCtrl', ['$scope', '$state', '$q', 'lanHelper', lanCtrl]);
})();
