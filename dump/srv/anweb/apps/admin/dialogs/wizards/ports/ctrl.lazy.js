'use strict';
!(function() {
  function PortsWizardSourceDialogController($scope, translate, device) {
    function getPtmL2Key() {
      _.find($scope.connections, function(elem, inx) {
        return (
          'PTM' == elem.port && ($scope.model.l2Key = inx), 'PTM' == elem.port
        );
      });
    }
    function getEtherwanL2Key() {
      _.find($scope.connections, function(elem, inx) {
        return elem.port == $scope.model.port
          ? (($scope.model.l2Key = inx), !0)
          : void 0;
      });
    }
    function isConflict() {
      return (
        ($scope.confConn = checkConflictConnections()),
        $scope.confConn.length > 0 ? !0 : !1
      );
    }
    function checkConflictConnections() {
      var confConn = [];
      if ('PTM' == $scope.model.port) {
        var ptmIface = $scope.connections[$scope.model.l2Key];
        ptmIface &&
          ptmIface.services &&
          !_.isEmpty(ptmIface.services) &&
          _.each(ptmIface.services, function(elem, inx) {
            ('bridge' != elem.type && 'ip' != elem.type) ||
              (((elem.vlan && elem.vlan.vlanid) || $scope.model.vid) &&
                (!elem.vlan || elem.vlan.vlanid != $scope.model.vid)) ||
              confConn.push({ l3Key: elem.iface });
          });
      }
      return confConn;
    }
    var portAllocation = device.portAllocation;
    ($scope.model = $scope.ngDialogData.source),
      ($scope.sources = $scope.ngDialogData.sources),
      ($scope.connections = $scope.ngDialogData.connections),
      ($scope.deviceClass = $scope.ngDialogData.deviceClass),
      ($scope.isEditable = $scope.ngDialogData.isEditable),
      ($scope.vlanIdRequired = $scope.ngDialogData.vlanIdRequired),
      ($scope.availIfaces = $scope.ngDialogData.availIfaces),
      ($scope.busyPVC = $scope.ngDialogData.busyPVC),
      ($scope.showIfaces = $scope.availIfaces.length > 1 ? !0 : !1);
    var initialModel = _.clone($scope.model);
    ($scope.validateSourceName = function(value) {
      var alreadyExists =
        _.contains($scope.ngDialogData.reservedNames, value) &&
        initialModel.name != value;
      return alreadyExists ? 'ports_wizard_source_name_reserved' : null;
    }),
      ($scope.validateVlan = function(value) {
        var alreadyExists =
          _.contains($scope.ngDialogData.reservedVlans, value) &&
          initialModel.vid != value;
        return alreadyExists ? 'ports_wizard_source_vlan_reserved' : null;
      }),
      ($scope.saveSource = function() {
        if (!$scope.groupSourceEdit.$invalid) {
          if (
            ('DSL' == $scope.deviceClass &&
              ('PTM' == $scope.model.port
                ? getPtmL2Key()
                : /^LAN\d/.test($scope.model.port) && getEtherwanL2Key()),
            'DSL' == $scope.deviceClass &&
              !$scope.model.isDeleted &&
              isConflict())
          ) {
            if (!confirm(translate('overwritingWanConnectionWarningAnswer')))
              return;
            var id = null,
              l3Key = $scope.confConn[0].l3Key;
            _.find($scope.sources, function(elem, inx) {
              elem.l3Key == l3Key && (id = inx);
            }),
              portAllocation.removeSource(id, l3Key);
          }
          $scope.closeThisDialog($scope.model);
        }
      }),
      ($scope.checkPVC = function(vpi, vci) {
        var pvc = vpi + '/' + vci;
        return _.contains($scope.busyPVC, pvc) ? 'error_pvc_used' : null;
      }),
      ($scope.removeSource = function() {
        ($scope.model.isDeleted = !0), $scope.closeThisDialog($scope.model);
      }),
      ($scope.select = {
        QoSClass: [
          { name: 'UBR', value: 'ubr' },
          { name: 'UBR with PCR', value: 'ubr_pcr' },
          { name: 'CBR', value: 'cbr' },
          { name: 'Non Realtime VBR', value: 'nrtvbr' },
          { name: 'Realtime VBR', value: 'rtvbr' },
        ],
        Encapsulation: [
          { name: 'LLC', value: 'llc' },
          { name: 'VCMUX', value: 'vcmux' },
        ],
      }),
      ($scope.isShow = function(param) {
        switch (param) {
          case 'VPI':
          case 'VCI':
          case 'QoSClass':
          case 'Encapsulation':
            return 'DSL' == $scope.model.port;
          case 'PeakCellRate':
            return 'DSL' == $scope.model.port && 'ubr' != $scope.model.qos;
          case 'SustainableCellRate':
          case 'MaximumBurstSize':
            return (
              'DSL' == $scope.model.port &&
              ('nrtvbr' == $scope.model.qos || 'rtvbr' == $scope.model.QoSClass)
            );
          case 'RemoveBtn':
            return 'DSL' == $scope.deviceClass
              ? !$scope.model.isNew &&
                  $scope.isEditable &&
                  ($scope.model.isRemovable ||
                    'undefined' == $scope.model.isRemovable)
              : !$scope.model.isNew && $scope.isEditable;
        }
        return !0;
      }),
      ($scope.isRequired = function(param) {
        switch (param) {
          case 'PeakCellRate':
          case 'SustainableCellRate':
          case 'MaximumBurstSize':
            return $scope.model.isNew;
        }
        return !1;
      }),
      ($scope.isDisabled = function(param) {
        switch (param) {
          case 'Iface':
          case 'VPI':
          case 'VCI':
          case 'Encapsulation':
          case 'QoSClass':
          case 'PeakCellRate':
          case 'SustainableCellRate':
          case 'MaximumBurstSize':
            return !$scope.model.isNew;
          case 'VlanId':
            return !$scope.isEditable;
        }
        return !1;
      });
  }
  angular
    .module('app')
    .controllerProvider.register(
      'PortsWizardSourceDialogController',
      PortsWizardSourceDialogController
    ),
    (PortsWizardSourceDialogController.$inject = [
      '$scope',
      'translate',
      'device',
    ]);
})();
