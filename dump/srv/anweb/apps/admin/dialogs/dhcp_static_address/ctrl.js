'use strict';
function DHCPStaticAddressDialogCtrl($scope, funcs) {
  var options = $scope.ngDialogData,
    iface = $scope.device.lan['interface'].getCurrent(),
    version = $scope.ngDialogData.version;
  ($scope.version = version),
    ($scope.staticAddress = {
      data: { IPAddress: '', MACAddress: '', Hostname: '' },
      initData: null,
      instance: null,
      init: function(util, data, instance) {
        (this.util = util),
          data && _.extend(this.data, data),
          instance && (this.instance = instance),
          (this.initData = angular.copy(this.data)),
          (this.usedValues = this.util.usedValues(this.instance)),
          (this.network = $scope.$parent[version].data.StaticIP[1]),
          'ipv4' == version &&
            ((this.subnet = funcs[version].subnet.getNetworkAddress(
              this.network.Address,
              this.network.SubnetMask
            )),
            (this.mask = funcs[version].mask['short'](
              this.network.SubnetMask
            ))),
          'ipv6' == version &&
            ((this.subnet = funcs[version].subnet.getNetworkAddress(
              this.network.Address,
              this.network.SubnetMask
            )),
            (this.prefix = this.network.Prefix));
      },
      validation: function(value, param) {
        var errors = this.util.validation(this.data),
          usedValues = this.usedValues[param],
          gatewayAddress = this.network.Address;
        return (
          'IPAddress' == param &&
            gatewayAddress == value &&
            errors[param].push('error_ip_address_is_used_as_lan_ip'),
          _.contains(usedValues, value) &&
            ('IPAddress' == param && errors[param].push('ip_address_is_used'),
            'MACAddress' == param && errors[param].push('mac_address_is_used')),
          errors[param].length ? errors[param][0] : null
        );
      },
      warning: function() {
        if (this.network.Address == this.data.IPAddress)
          return 'ip_address_is_equal_ip_address_router';
        var isIncludedToNetwork = this.util.checkForEntryInSubnet(
          this.data.IPAddress,
          this.network
        );
        return isIncludedToNetwork
          ? null
          : 'ip_address_is_not_included_to_network';
      },
      isChange: function() {
        return !_.isEqual(this.initData, this.data);
      },
    }),
    ($scope.staticAddress.dialog = {
      action: options.action,
      onApply: function() {
        $scope.form.$valid &&
          $scope.closeThisDialog({
            action: this.action,
            data: $scope.staticAddress.data,
            instance: $scope.staticAddress.instance,
          });
      },
      onRemove: function() {
        $scope.closeThisDialog({
          action: 'remove',
          instance: $scope.staticAddress.instance,
        });
      },
      onCancel: function() {
        $scope.closeThisDialog(null);
      },
    }),
    $scope.staticAddress.init(
      iface[version].dhcp.staticAddress,
      options.data,
      options.instance
    );
}
