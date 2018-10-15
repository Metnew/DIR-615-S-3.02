'use strict';
!(function() {
  function WizardPortsController(
    $scope,
    translate,
    device,
    devinfo,
    ngDialog,
    funcs,
    snackbars
  ) {
    function getSourcesList() {
      var list = _.map($scope.sources, function(value, inx) {
        return { label: value.name, value: inx };
      });
      return (
        list.unshift({
          label: translate('ports_wizard_port_free'),
          value: null,
        }),
        list
      );
    }
    function activate() {
      portAllocation.pull().then(function() {
        updateViewModel(),
          devinfo.onceAndSubscribe(
            'client|ports',
            function(data) {
              updatePortInfo(data),
                showNotification(data),
                $scope.$emit('pageload');
            },
            $scope
          );
      });
    }
    function updatePortInfo(data) {
      var managementPort = data
        ? _.findWhere(data.availPorts, { management: !0 })
        : null;
      $scope.managementPort = managementPort
        ? managementPort.alias
          ? managementPort.alias
          : managementPort.name
        : null;
      var internetPort = data
        ? _.findWhere(data.availPorts, { name: 'internet' }) ||
          _.findWhere(data.availPorts, { name: 'port5' })
        : null;
      internetPort && ($scope.internetType = internetPort.mediaType);
    }
    function showNotification(data) {
      var client = data.client,
        hasManagamentPort = data
          ? _.findWhere(data.availPorts, { management: !0 })
          : null;
      !_.isEmpty(client) &&
      'LAN' == client.name &&
      _.isUndefined(hasManagamentPort)
        ? ($scope.needShowNotification = !0)
        : _.isEmpty(client) &&
          _.isUndefined(hasManagamentPort) &&
          ($scope.needShowNotification = !0);
    }
    function updateViewModel() {
      ($scope.deviceClass = portAllocation.getDeviceClass()),
        ($scope.sources = portAllocation.sources()),
        ($scope.ports = portAllocation.ports()),
        ($scope.sourcesList = getSourcesList());
    }
    function save() {
      function sourceHasPorts(sourceId) {
        return _.some($scope.ports, function(port) {
          return port.bridge == sourceId;
        });
      }
      if ('DIR' == $scope.deviceClass) {
        var invalidBridges = _.filter($scope.sources, function(source, inx) {
          return 'bridge' == source.type && !sourceHasPorts(inx);
        });
        if (invalidBridges.length) {
          var message =
            translate('ports_wizard_need_select_ports') +
            ' ' +
            _.map(invalidBridges, function(b) {
              return '"' + b.name + '"';
            }).join(',');
          return void alert(message);
        }
      }
      portAllocation
        .push(function(status) {
          snackbars.add(status ? 'rpc_write_error' : 'rpc_write_success');
        })
        .then(activate);
    }
    function getPortTitle(port) {
      if (port.isWifi) {
        var naIndex = port.name.indexOf('-na'),
          protName = naIndex > -1 ? port.name.substring(0, naIndex) : port.name,
          postfix =
            naIndex > -1
              ? ' (' + translate('ports_wizard_wifi_not_active') + ')'
              : '';
        return protName + postfix;
      }
      return port.alias;
    }
    function createSource() {
      'DSL' == $scope.deviceClass
        ? editSource(null, {
            isNew: !0,
            enabled: !0,
            port: 'DSL',
            type: 'atm',
            qos: 'ubr',
            encap: 'llc',
            vid: null,
          })
        : editSource(null, { isNew: !0, enabled: !0, type: 'bridge' });
    }
    function editSource(sourceId, source) {
      var model = _.extend({}, source),
        dialog = ngDialog.open({
          template: 'dialogs/wizards/ports/dialog.tpl.html',
          controller: 'PortsWizardSourceDialogController',
          resolve: funcs.getLazyResolve(
            'dialogs/wizards/ports/ctrl.lazy.js',
            'PortsWizardSourceDialogController'
          ),
          data: {
            source: model,
            sources: portAllocation.sources(),
            connections: portAllocation.connections(),
            deviceClass: portAllocation.getDeviceClass(),
            availIfaces: portAllocation.availIfaces(),
            busyPVC: portAllocation.getBusyPVC(),
            reservedNames: portAllocation.getReservedNames(),
            reservedVlans: portAllocation.getReservedVlans(),
            isEditable: portAllocation.sourceIsEditable(source),
            vlanIdRequired: portAllocation.hasDefaultWanSource(),
          },
        });
      dialog.closePromise.then(function(result) {
        if (result && result.value && !_.isString(result.value)) {
          var mapped = mapSource(result.value);
          result.value.isDeleted
            ? portAllocation.removeSource(sourceId, source.l3Key)
            : result.value.isNew && null == sourceId
              ? portAllocation.addSource(mapped)
              : portAllocation.updateSource(sourceId, mapped),
            updateViewModel();
        }
      });
    }
    function mapSource(data) {
      var changeData = {
        name: data.name,
        l2Key: data.l2Key,
        enabled: !!data.enabled,
        vid: data.vid,
        type: getType(data),
        vpi: data.vpi,
        vci: data.vci,
        qos: data.qos,
        encap: data.encap,
        port: data.port,
      };
      return _.extend(data, changeData);
    }
    function getType(data) {
      switch (data.port) {
        case 'DSL':
          return 'atm';
        case 'PTM':
          return 'ethernet';
      }
      return 'ethernet';
    }
    function getSourceIconClass(item) {
      switch ($scope.internetType) {
        case 'pon':
          return 'pon';
        case 'fiber':
          return 'fiber';
      }
      return 'ethernet';
    }
    function getPortIconClass(item) {
      return item.isWifi ? 'wifi' : 'ethernet';
    }
    function saveEnabled() {
      return portAllocation.isChanged();
    }
    function togglePortSimple(port) {
      if (
        showSimpleMode() &&
        canTogglePortSimple(port) &&
        !portIsManagement(port)
      ) {
        if (port.bridge) return void (port.bridge = null);
        if ('DSL' == $scope.deviceClass) {
          var defaultSource = portAllocation.getDefaultSource();
          port.bridge = defaultSource ? defaultSource.name : null;
        } else port.bridge = portAllocation.getDefaultSourceId();
      }
    }
    function canTogglePortSimple(port) {
      return !getPortDisabledMessage(port);
    }
    function getPortDisabledMessage(port) {
      return portIsManagement(port)
        ? 'on_this_port'
        : portAllocation.portInBridge(port)
          ? 'ports_wizard_port_in_bridge'
          : portAllocation.hasDefaultWanSource()
            ? null
            : 'ports_wizard_no_default_wan';
    }
    function portIsSelected(port) {
      return 'DSL' == $scope.deviceClass
        ? !!port.bridge && port.isEditable
        : !!port.bridge;
    }
    function portIsManagement(port) {
      return port.alias == $scope.managementPort;
    }
    function portIsBusy(port) {
      return 'DSL' == $scope.deviceClass && port.isBusy ? !0 : !1;
    }
    function portIsNotEditable(port) {
      return 'DSL' == $scope.deviceClass ? (port.isEditable ? !1 : !0) : !1;
    }
    function showSimpleMode() {
      return !$scope.forceExtendedMode && canShowSimpleMode();
    }
    function toggleMode() {
      $scope.forceExtendedMode = !$scope.forceExtendedMode;
    }
    function canShowSimpleMode() {
      return 'DSL' != $scope.deviceClass ? !0 : !1;
    }
    function getNote() {
      var note;
      return (note =
        'DSL' == $scope.deviceClass
          ? translate('ports_allocation_dsl_note') +
            ' <a ui-sref="advanced.ifgroups.list">' +
            translate('navAdvanced') +
            '/' +
            translate('navIfGrouping') +
            '</a>'
          : translate('ports_allocation_note'));
    }
    function isUnactiveWifi(item) {
      var regexp = /^\w+-na$/;
      return item && item.isWifi && regexp.test(item.name);
    }
    var portAllocation = device.portAllocation;
    ($scope.needShowNotification = !1),
      _.extend($scope, {
        internetType: null,
        getSourcesList: getSourcesList,
        getPortTitle: getPortTitle,
        editSource: editSource,
        createSource: createSource,
        getPortIconClass: getPortIconClass,
        getSourceIconClass: getSourceIconClass,
        portIsSelected: portIsSelected,
        portIsBusy: portIsBusy,
        portIsNotEditable: portIsNotEditable,
        togglePortSimple: togglePortSimple,
        saveEnabled: saveEnabled,
        save: save,
        showSimpleMode: showSimpleMode,
        canShowSimpleMode: canShowSimpleMode,
        canTogglePortSimple: canTogglePortSimple,
        getPortDisabledMessage: getPortDisabledMessage,
        getNote: getNote,
        toggleMode: toggleMode,
        portIsManagement: portIsManagement,
        isUnactiveWifi: isUnactiveWifi,
      }),
      activate();
  }
  angular
    .module('app')
    .controllerProvider.register(
      'WizardPortsController',
      WizardPortsController
    ),
    (WizardPortsController.$inject = [
      '$scope',
      'translate',
      'device',
      'devinfo',
      'ngDialog',
      'funcs',
      'snackbars',
    ]);
})();
