'use strict';
!(function() {
  function lanIPv4Ctrl($scope, $state, ngDialog, helper, devinfo) {
    function checkModes() {
      return $scope.ipv4.supported.AddressingMode
        ? _.without(
            constraints.dhcp.modes,
            _.findWhere(constraints.dhcp.modes, { value: 'Relay' })
          )
        : constraints.dhcp.modes;
    }
    function getAddressingModes() {
      return _.filter(constraints.addressingModes, function(obj) {
        return _.contains(supported.AddressingModeAvailable, obj.value);
      });
    }
    function update() {
      (iface = lan['interface'].getCurrent()),
        iface && $scope.ipv4.update(iface.ipv4);
    }
    function setActive($event, version) {
      $scope.ipv4.isActive = 'IPv4' == version;
    }
    var iface,
      lan = $scope.device.lan,
      supported = helper.supported.ipv4(),
      constraints = helper.constraints.ipv4();
    ($scope.ipv4 = {
      isActive: !1,
      supported: supported,
      constraints: constraints,
      util: null,
      data: null,
      addressingModes: getAddressingModes(),
      update: function(util) {
        (this.util = util),
          (this.data = this.util.data()),
          this.staticIP.update(util.staticIP),
          this.dhcp.update(util.dhcp);
      },
      getMinHosts: function() {
        return 'Disable' == $scope.ipv4.dhcp.data.Mode
          ? constraints.MinHostsDhcpOff
          : constraints.MinHosts;
      },
    }),
      ($scope.ipv4.staticIP = {
        util: null,
        list: [],
        basic: { instance: null, data: null },
        alias: { instance: null, data: null },
        hasAlias: function() {
          return _.size(this.list) > 1;
        },
        update: function(util, instance) {
          (this.util = util),
            this.util.setOptions({
              MinHosts: constraints.MinHosts,
              MinHostsDhcpOff: constraints.MinHostsDhcpOff,
              MaxHosts: constraints.MaxHosts,
            }),
            (this.list = this.util.list()),
            (this.basic.instance = '1'),
            (this.basic.data = this.util.get('1')),
            this.hasAlias() &&
              ((this.alias.instance = '2'),
              (this.alias.data = this.util.get('2')));
        },
        validation: function(value, param, obj) {
          var data = obj.data,
            instance = obj.instance;
          if (!data) return null;
          var dhcpOffFlag = 'Disable' == $scope.ipv4.dhcp.data.Mode ? !0 : !1,
            errors = this.util.validation(data, dhcpOffFlag);
          if (errors[param].length) return errors[param][0];
          if ('Address' == param) {
            var conflicts = this.util.conflicts(instance);
            if (conflicts.length) return 'error_subnet_conflicts';
          }
          return null;
        },
        isDisabled: function() {
          return $scope.ipv4.data
            ? 'Static' != $scope.ipv4.data.AddressingMode
            : !1;
        },
      }),
      ($scope.ipv4.dhcp = {
        util: null,
        data: null,
        modes: checkModes(),
        update: function(util) {
          (this.util = util),
            (this.data = this.util.data()),
            this.staticAddresses.update(util.staticAddress);
        },
        validation: function(value, param) {
          if (!this.data) return null;
          var errors = this.util.validation(this.data);
          return errors[param].length ? errors[param][0] : null;
        },
        validationOnSubmit: function(value, param) {
          return $scope.form.submitted ? this.validation(value, param) : !1;
        },
      }),
      ($scope.ipv4.dhcp.staticAddresses = {
        supported: supported.DHCP.Server.StaticAddress,
        list: {},
        isEmpty: function() {
          return this.list && 0 == _.size(this.list);
        },
        reset: function() {
          this.list = {};
          var rules = this.util.list();
          _.each(
            rules,
            function(rule, instance) {
              'cut' != this.util.getInstanceState(instance) &&
                (this.list[instance] = rule);
            },
            this
          );
        },
        update: function(util) {
          (this.util = util), (this.mode = util.mode()), this.reset();
        },
        onAdd: function() {
          var options = { action: 'add', version: 'ipv4' };
          this.dialog(options);
        },
        onEdit: function(item, instance) {
          var options = {
            action: 'edit',
            data: item,
            version: 'ipv4',
            instance: instance,
          };
          this.dialog(options);
        },
        onDelete: function(items, instances) {
          _.each(
            instances,
            function(instance) {
              'add' == this.util.getInstanceState(instance)
                ? this.util.remove(instance)
                : this.util.cut(instance);
            },
            this
          ),
            this.reset();
        },
        onSelectClients: function() {
          var options = {
            ipversion: 'ipv4',
            comment: 'lanDHCPStaticAddressSelectClientsComment',
          };
          this.dialogSelectClients(options);
        },
        getMiniInfo: function(item) {
          var info = '';
          return (
            item.MACAddress && (info += item.MACAddress),
            item.MACAddress && item.Hostname && (info += '/'),
            item.Hostname && (info += item.Hostname),
            info
          );
        },
        dialog: function(options) {
          function startDialog(options) {
            return ngDialog.open({
              template: 'dialogs/dhcp_static_address/dialog.tpl.html',
              controller: 'DHCPStaticAddressDialogCtrl',
              scope: $scope,
              data: options,
            });
          }
          function closeDialog(dialogData) {
            var util = self.util,
              result = dialogData.value;
            if (!_.isNull(result)) {
              switch (result.action) {
                case 'add':
                  util.add(result.data);
                  break;
                case 'edit':
                  util.cut(result.instance),
                    util.set(result.data, result.instance);
                  break;
                case 'remove':
                  'add' == util.getInstanceState(result.instance)
                    ? util.remove(result.instance)
                    : util.cut(result.instance);
              }
              self.reset();
            }
          }
          var self = this;
          startDialog(options).closePromise.then(closeDialog);
        },
        dialogSelectClients: function(options) {
          function startDialog(options) {
            return ngDialog.open({
              template: 'dialogs/device_clients_list/dialog.tpl.html',
              controller: 'DeviceClientsListDialogCtrl',
              data: options,
            });
          }
          function closeDialog(dialogData) {
            var util = self.util,
              list = dialogData.value;
            !_.isNull(list) &&
              _.isArray(list) &&
              ((list = _.map(list, normalization)),
              (list = _.filter(list, function(item) {
                return !util.isUseRule(item);
              })),
              list.length &&
                (_.each(list, function(item) {
                  util.add(item);
                }),
                self.reset()));
          }
          function normalization(item) {
            var result = {};
            return (
              (result.IPAddress = item.ip ? item.ip : ''),
              (result.MACAddress = item.mac ? item.mac : ''),
              (result.Hostname = item.hostname ? item.hostname : ''),
              (result.Mode = item.mode ? item.mode : ''),
              result
            );
          }
          var self = this;
          startDialog(options).closePromise.then(closeDialog);
        },
      }),
      update(),
      $scope.$on('lan.update', update),
      $scope.$on('lan.interface.update', update),
      $scope.$on('lan.ipversion', setActive);
  }
  angular
    .module('app')
    .controller('lanIPv4Ctrl', [
      '$scope',
      '$state',
      'ngDialog',
      'lanHelper',
      'devinfo',
      lanIPv4Ctrl,
    ]);
})();
