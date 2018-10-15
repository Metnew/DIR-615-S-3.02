'use strict';
function wanEditCtrl($scope) {
  function activate() {
    pageLoadStart(),
      core.fetch().then(function() {
        var connection = wan[type].get(index),
          contype = helper.connection.identifyActualType(connection, type),
          iface = helper.media.buildInterface(connection);
        _.extend($scope.wan.model.connection, connection),
          ($scope.wan.model.contype = contype),
          ($scope.wan.model['interface'] = iface);
        var stateInfo = helper.connection.getStateInfo(contype);
        $state.go(currentState + '.edit' + stateInfo.path, stateInfo.params);
      });
  }
  function apply() {
    if ($scope.form.$valid) {
      var connection = $scope.wan.model.connection;
      wan[type].cut(index),
        wan[type].set(connection, index),
        connection.Flags &&
          connection.Flags.MLD &&
          device.wan.setMLDInstance(index);
      var overlay = $scope.overlay.circular,
        overlayId = overlay.start();
      $scope.wanCore
        .save()
        .then(function() {
          (currentState = currentState.split('.')),
            'connection' == currentState[currentState.length - 1] &&
              currentState.pop(),
            (currentState = currentState.join('.')),
            $state.go(currentState + '.info');
        })
        ['finally'](overlay.stop.bind(overlay, overlayId));
    }
  }
  function remove() {
    core.cut({ type: type, inx: index }).then(function() {
      $rootScope.$emit('unsavedStop', !0);
      var overlay = $scope.overlay.circular,
        overlayId = overlay.start();
      $scope.wanCore
        .save()
        .then(function() {
          history.setCleanLastHistory(!0),
            (currentState = currentState.split('.')),
            'connection' == currentState[currentState.length - 1] &&
              currentState.pop(),
            (currentState = currentState.join('.')),
            $state.go(currentState + '.info');
        })
        ['finally'](overlay.stop.bind(overlay, overlayId));
    });
  }
  function has(field) {
    switch (field) {
      case 'ButtonRemove':
        return core.mode.isAdvancedMode();
    }
    return !0;
  }
  function pageLoadStart() {
    $scope.wan.backup.clean(), ($scope.wan.isActivate = !1);
  }
  function pageLoadEnd() {
    $timeout(function() {
      $scope.wan.backup.set($scope.wan.model.connection);
    }),
      $scope.wan.isActivate ||
        (($scope.wan.isActivate = !0), $scope.$emit('pageload'));
  }
  function setMode($event, mode) {
    $scope.wan.mode = mode;
  }
  var $rootScope = $scope.__args.$rootScope,
    $state = $scope.__args.$state,
    $timeout = $scope.__args.$timeout,
    history = ($scope.__args.translate, $scope.__args.history),
    helper = $scope.__args.wanHelper,
    device = $scope.device,
    wan = device.wan,
    type = $state.params.type,
    index = $state.params.inx,
    core = $scope.wanCore;
  ($scope.wan = {
    model: { interface: {}, contype: {}, connection: {} },
    activate: activate,
    apply: apply,
    remove: remove,
    has: has,
  }),
    ($scope.wan.backup = core.connection.makeBackup()),
    ($scope.wan.action = core.connection.identifyAction()),
    ($scope.wan.isActivate = !1),
    $scope.$on('wan.header.state', setMode),
    $scope.$on('wan.header.change', setMode),
    $scope.$on('$stateChangeSuccess', pageLoadEnd);
  var currentState = $state.current.name.split('.');
  currentState.pop(), (currentState = currentState.join('.')), activate();
}
