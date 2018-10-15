'use strict';
!(function() {
  function lanIPv6Ctrl($scope, $state, ngDialog, helper) {
    function update() {
      (iface = lan['interface'].getCurrent()),
        iface && $scope.ipv6.update(iface.ipv6);
    }
    function setActive($event, version) {
      $scope.ipv6.isActive = 'IPv6' == version;
    }
    function getAddressingModes() {
      return _.filter(constraints.addressingModes, function(obj) {
        return _.contains(supported.AddressingModeAvailable, obj.value);
      });
    }
    var iface,
      lan = $scope.device.lan,
      supported = helper.supported.ipv6(),
      constraints = helper.constraints.ipv6();
    ($scope.ipv6 = {
      isActive: !1,
      supported: supported,
      addressingModes: getAddressingModes(),
      util: null,
      data: null,
      update: function(util) {
        (this.util = util),
          (this.data = this.util.data()),
          this.staticIP.update(util.staticIP),
          this.dhcp.update(util.dhcp);
      },
    }),
      ($scope.ipv6.staticIP = {
        list: [],
        util: null,
        basic: { instance: null, data: null },
        update: function(util, instance) {
          (this.util = util),
            this.util.setOptions({
              minPrefix: constraints.MinPrefix,
              maxPrefix: constraints.MaxPrefix,
            }),
            (this.list = this.util.list()),
            (this.basic.instance = instance || '1'),
            (this.basic.data = this.util.get(this.basic.instance));
        },
        isDisabled: function() {
          return $scope.ipv6.data
            ? 'Static' != $scope.ipv6.data.AddressingMode
            : !1;
        },
        validation: function(value, param) {
          var data = this.basic.data;
          if (!data) return null;
          var errors = this.util.validation(data);
          return errors[param].length ? errors[param][0] : null;
        },
      }),
      ($scope.ipv6.dhcp = {
        util: null,
        data: null,
        modes: constraints.dhcp.modes,
        autoconfigurationModes: constraints.dhcp.autoconfigurationModes,
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
      ($scope.ipv6.dhcp.server = {
        supported: supported.DHCP.Server,
        isShow: function(param) {
          var data = $scope.ipv6.dhcp.data.Server;
          if (1 != this.supported[param]) return !1;
          switch (param) {
            case 'MinAddress':
            case 'MaxAddress':
              if ('Stateless' == data.AutoconfigurationMode) return !1;
          }
          return !0;
        },
        isDisabled: function(param) {
          if (!$scope.ipv6.data) return !1;
          switch (param) {
            case 'LeaseTime':
              if ('PD' == $scope.ipv6.data.AddressingMode) return !0;
          }
          return !1;
        },
      }),
      ($scope.ipv6.dhcp.staticAddresses = {
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
          var options = { action: 'add', version: 'ipv6' };
          this.dialog(options);
        },
        onEdit: function(item, instance) {
          var options = {
            action: 'edit',
            data: item,
            version: 'ipv6',
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
            ipversion: 'ipv6',
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
    .controller('lanIPv6Ctrl', [
      '$scope',
      '$state',
      'ngDialog',
      'lanHelper',
      lanIPv6Ctrl,
    ]);
})();
