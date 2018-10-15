'use strict';
function WanInfoCtrl($scope) {
  function activate() {
    core.fetch(!0).then(function() {
      info.make(),
        (info.isActivate = !0),
        $scope.$broadcast('wan.info.activate', info.raws),
        $scope.$emit('pageload');
      var area = wan.getWanUpdateArea();
      devinfo.subscribe(area, updateRows, $scope);
    });
  }
  function update() {
    var overlay = $scope.overlay.circular,
      overlayId = overlay.start();
    core
      .update()
      .then(function() {
        info.make(), $scope.$broadcast('wan.info.update', info.raws);
      })
      ['finally'](overlay.stop.bind(overlay, overlayId));
  }
  function make() {
    clean();
    var types = getConnectionTypes();
    info.raws = info.raws.concat(wan.flattenConnections(types));
  }
  function clean() {
    info.raws.length = 0;
  }
  function updateRows(data) {
    var area = wan.getWanUpdateArea();
    data && data[area] && wan.setData(data[area]),
      $scope.$broadcast('wan.info.update_raws', info.raws);
  }
  function getConnectionTypes() {
    return helper.connection.getAllSupportedGeneralTypes();
  }
  var device = $scope.device,
    devinfo = ($scope.__args.$state,
    $scope.__args.$q,
    $scope.__args.$timeout,
    $scope.__args.devinfo),
    helper = ($scope.__args.translate, $scope.__args.wanHelper),
    wan = device.wan,
    supported = device.wan.supported(),
    core = $scope.wanCore;
  $scope.wan || ($scope.wan = {}),
    ($scope.wan.info = {
      raws: [],
      update: update,
      make: make,
      clean: clean,
      supported: supported,
    }),
    ($scope.wan.info.isActivate = !1);
  var info = $scope.wan.info;
  activate();
}
