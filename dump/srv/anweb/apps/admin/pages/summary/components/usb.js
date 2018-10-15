'use strict';
!(function() {
  function SummaryUsbService(devinfo, summaryConstants, $state, translate) {
    function getRpcList() {
      var list = [];
      return (
        summaryConstants.DONGLE_SUPPORT &&
          list.push({
            rpc: summaryConstants.DONGLE_RPC,
            handler: dongleHandler,
          }),
        summaryConstants.STORAGE_SUPPORT &&
          list.push({
            rpc: summaryConstants.STORAGE_RPC,
            handler: storageHandler,
          }),
        summaryConstants.PRINTSERVER_SUPPORT &&
          list.push({
            rpc: summaryConstants.PRINTSERVER_RPC,
            handler: printHandler,
          }),
        list
      );
    }
    function dongleHandler(data) {
      return (
        data ? (backupDongleData = data) : (data = backupDongleData),
        data && data.status
          ? {
              icon: 'usb_modem',
              name: data.vendor.toUpperCase() + ' ' + data.model,
              link: $state.href('usbmodem.basic'),
            }
          : null
      );
    }
    function storageHandler(data) {
      var data = data || {};
      return _.map(data.usb_storage, function(item) {
        return _.isUndefined(item.name)
          ? null
          : {
              icon: 'usb',
              name: item.name,
              link: $state.href('storage.filebrowser'),
            };
      });
    }
    function printHandler(data) {
      return data && data.enable && data.connected
        ? {
            icon: 'print',
            name: translate('summaryUsbDevicePrinter'),
            link: $state.href('printserver'),
          }
        : null;
    }
    function createUsbHandler() {
      return function(data) {
        if (data) {
          var devices = _.map(rpcList, function(item) {
            return item.handler(data[item.rpc]);
          });
          (usbInfo.devices = _.compact(_.flatten(devices))),
            (usbInfo.isEmpty = !usbInfo.devices.length);
        }
      };
    }
    function get() {
      return usbInfo
        ? usbInfo
        : (usbInfo = {
            area: _.pluck(rpcList, 'rpc').join('|'),
            devinfoHandler: createUsbHandler(),
            devices: [],
            isEmpty: !0,
          });
    }
    var usbInfo = null,
      rpcList = getRpcList(),
      backupDongleData = null;
    return { get: get };
  }
  angular.module('app').factory('summaryUsb', SummaryUsbService),
    (SummaryUsbService.$inject = [
      'devinfo',
      'summaryConstants',
      '$state',
      'translate',
    ]);
})();
