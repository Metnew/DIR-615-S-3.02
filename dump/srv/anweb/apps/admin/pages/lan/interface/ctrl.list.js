'use strict';
!(function() {
  function lanInterfaceListCtrl(
    $scope,
    $state,
    $q,
    $timeout,
    translate,
    helper
  ) {
    function activate() {
      var iface = $scope.device.lan['interface'],
        current = iface.getCurrent();
      if (!_.isNull(current)) {
        var newInterfaces = iface.listNew(),
          allInterfaces = iface.list(),
          current = iface.getCurrent();
        $scope.lanForm['interface'].init(current, newInterfaces, allInterfaces);
      }
    }
    var supported = helper.supported.lan();
    ($scope.lanForm['interface'] = {
      listLen: 0,
      listNew: [],
      state: null,
      data: null,
      init: function(current, newInterfaces, allInterfaces) {
        function addNewState(iface, instance) {
          this.listNew.push({ value: instance, description: iface.__vlanName });
        }
        (this.listLen = _.size(allInterfaces)),
          (this.listNew.length = 0),
          _.each(newInterfaces, addNewState, this),
          (this.state = $scope.lanForm.inx),
          (this.data = current.data);
      },
      change: function() {
        $scope.$emit('lan.interface.change', this.state);
      },
      isShowCard: function() {
        return this.listLen > 1;
      },
      isShowList: function() {
        return this.listNew.length > 1;
      },
      isShowInput: function() {
        return 1 == this.listNew.length;
      },
      isShowVlan: function() {
        return supported.SUPPORT_MULTI_LAN;
      },
    }),
      activate(),
      $scope.$on('lan.update', activate);
  }
  angular
    .module('app')
    .controller('lanInterfaceListCtrl', [
      '$scope',
      '$state',
      '$q',
      '$timeout',
      'translate',
      'lanHelper',
      lanInterfaceListCtrl,
    ]);
})();
