'use strict';
!(function() {
  function WanReservCtrl($scope, $state, translate, funcs, snackbars, util) {
    function activate(overlayId) {
      function success(response) {
        (wanreserv.config = util.getConfig()),
          (helper = util.makeHelper()),
          (__backup = angular.copy(wanreserv.config)),
          (wanreserv.isActivate = !0);
      }
      function error(error) {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      function finallyCb() {
        $scope.$emit('pageload'),
          overlayId && overlay.stop(overlayId),
          ($scope.form.submitted = !1);
      }
      util
        .pull()
        .then(success)
        ['catch'](error)
        ['finally'](finallyCb);
    }
    function apply() {
      function success() {
        ($scope.form.submitted = !1),
          snackbars.add('apply_success'),
          activate(overlayId);
      }
      function error(error) {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' }),
          overlay.stop(overlayId);
      }
      function checkGw() {
        var config = wanreserv.config;
        if (!config.Enable || !util.needCheckGw) return !0;
        var gwConn = _.find(config.Connections, function(e) {
          return e.DefaultGateway;
        });
        return gwConn && gwConn.Value != config.Connection.Master
          ? confirm(translate('wanreservNotDefGateway'))
          : !0;
      }
      function checkRecheckTimeout() {
        var config = wanreserv.config;
        if (!config.Enable) return !0;
        var result = helper.checkRecheckTimeout(config);
        return result
          ? (alert(
              translate('wanreservRecheckTimeoutLessMin') +
                ' ' +
                result.minValue
            ),
            !1)
          : !0;
      }
      if (
        (($scope.form.submitted = !0),
        checkAllSlaveValidation(),
        !$scope.form.$invalid && checkGw() && checkRecheckTimeout())
      ) {
        var overlayId = overlay.start();
        util
          .apply(wanreserv.config)
          .then(success)
          ['catch'](error);
      }
    }
    function addHost() {
      wanreserv.config.Hosts.push('');
    }
    function removeHost(index) {
      wanreserv.config.Hosts.splice(index, 1);
    }
    function checkHost(host, index) {
      return helper.checkHost(host, wanreserv.config.Hosts, index);
    }
    function addSlave() {
      var freeConns = helper.getFreeConnections(wanreserv.config),
        value = freeConns.length ? freeConns[0] : '';
      wanreserv.config.Connection.Slave.push(value);
    }
    function removeSlave(index) {
      wanreserv.config.Connection.Slave.splice(index, 1);
    }
    function getTimeLabel(name) {
      return (
        'ms' == wanreserv.config.TimeSystem && (name += 'Ms'), translate(name)
      );
    }
    function getOneConnectionMsg() {
      return (
        translate('wanreservOneConnection') +
        ' <a ui-sref="network.wan.info">' +
        translate('navNetwork') +
        ' / ' +
        translate('navWAN') +
        '</a>'
      );
    }
    function checkSlaveValidation(value, index) {
      return $scope.form.submitted
        ? helper.isCrossMasterConnection(wanreserv.config, index)
          ? (($scope.form.$invalid = !0), translate('wanreservConnMatchError'))
          : helper.isCrossSlaveConnection(wanreserv.config, index)
            ? (($scope.form.$invalid = !0),
              translate('wanreservConnMatchUniqError'))
            : null
        : null;
    }
    function checkAllSlaveValidation() {
      _.each(wanreserv.config.Connection.Slave, function(e, index) {
        return checkSlaveValidation(e.Value, index);
      });
    }
    function hasConnections() {
      return wanreserv.config && wanreserv.config.Connections.length;
    }
    function hasFreeConnections() {
      return helper.checkFreeConnections(wanreserv.config);
    }
    function isOneConnection() {
      return wanreserv.config && 1 == wanreserv.config.Connections.length;
    }
    function isSupported(name) {
      return _.has(wanreserv.config, name);
    }
    function wasModified() {
      if (!__backup || !wanreserv.config) return null;
      var checkConfig = angular.fromJson(angular.toJson(wanreserv.config));
      return !funcs.deepEqual(__backup, checkConfig);
    }
    $scope.wanreserv = {
      isActivate: !1,
      config: null,
      apply: apply,
      removeHost: removeHost,
      addHost: addHost,
      checkHost: checkHost,
      addSlave: addSlave,
      removeSlave: removeSlave,
      checkSlaveValidation: checkSlaveValidation,
      getTimeLabel: getTimeLabel,
      getOneConnectionMsg: getOneConnectionMsg,
      hasConnections: hasConnections,
      hasFreeConnections: hasFreeConnections,
      isOneConnection: isOneConnection,
      isSupported: isSupported,
      wasModified: wasModified,
    };
    var wanreserv = $scope.wanreserv,
      overlay = $scope.overlay.circular,
      helper = null,
      __backup = null;
    activate();
  }
  angular
    .module('app')
    .controllerProvider.register('WanReservCtrl', [
      '$scope',
      '$state',
      'translate',
      'funcs',
      'snackbars',
      'wanReservationUtil',
      WanReservCtrl,
    ]);
})();
