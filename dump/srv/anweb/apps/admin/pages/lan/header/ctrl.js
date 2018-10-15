'use strict';
!(function() {
  function lanHeaderCtrl($scope, $state, $q, $timeout, translate, helper) {
    function changePrepare() {
      function check() {
        var deferred = $q.defer();
        return (
          $scope.lanForm.isValid()
            ? deferred.resolve(!0)
            : ($timeout(function() {
                alert(translate('invalidForm')),
                  $scope.$emit('goToErrorForm', !0);
              }, 0),
              deferred.resolve(null)),
          deferred.promise
        );
      }
      return $scope.lanForm.isNotification()
        ? $scope.lanForm.callNotification().then(check)
        : check();
    }
    function activate() {
      var iface = $scope.device.lan['interface'],
        current = iface.getCurrent();
      _.isNull(current) || $scope.lanForm.view.ip.init(current.data);
    }
    var supported = helper.supported.lan();
    ($scope.lanForm.view = {}),
      ($scope.lanForm.view.ip = {
        list: [],
        state: null,
        init: function(iface) {
          function addState(vers) {
            this.list.push({ value: vers, description: vers });
          }
          function hasState(iface, vers) {
            return iface[vers] && !_.isEmpty(iface[vers]) && supported[vers];
          }
          (this.list.length = 0),
            hasState(iface, 'IPv4') && addState.call(this, 'IPv4'),
            hasState(iface, 'IPv6') && addState.call(this, 'IPv6'),
            this.list.length &&
              _.isNull(this.state) &&
              (this.state = $state.params.ipversion
                ? $state.params.ipversion
                : this.list[0].value);
        },
        changePrepare: changePrepare,
        changeSuccess: function(toView) {
          (this.state = toView),
            $scope.$emit('lan.interface.ip.change', toView),
            $state.go('.', { ipversion: toView }, { notify: !1 });
        },
        isShow: function() {
          return this.list.length > 1;
        },
      }),
      activate(),
      $scope.$on('lan.update', activate);
  }
  angular
    .module('app')
    .controller('lanHeaderCtrl', [
      '$scope',
      '$state',
      '$q',
      '$timeout',
      'translate',
      'lanHelper',
      lanHeaderCtrl,
    ]);
})();
