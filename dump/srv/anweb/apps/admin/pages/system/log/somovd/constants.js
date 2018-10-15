'use strict';
!(function() {
  angular.module('app').constant('sysLogConstants', {
    STORAGE_SUPPORT: 'undefined' != typeof BR2_PACKAGE_ANWEB_STORAGE,
    STORAGE_FILEBROWSER_SUPPORT:
      'undefined' != typeof BR2_PACKAGE_ANWEB_STORAGE_FILEBROWSER,
    SYSLOG_CONF_RPC: 63,
    SYSLOG_READ_RPC: 130,
    INVALID_USB_PATH: 79,
    USB_VOLUME_RPC: 82,
    USB_UMOUNT_RPC: 154,
  });
})();
