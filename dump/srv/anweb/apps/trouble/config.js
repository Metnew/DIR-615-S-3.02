'use strict';
angular.module('app.config', []).constant('pageList', {
  wait: {
    html: ['/apps/trouble/pages/wait/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'waitCtrl',
  },
  connected: {
    html: ['/apps/trouble/pages/connected/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'connectedCtrl',
  },
  failed: {
    html: ['/apps/trouble/pages/failed/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'failedCtrl',
  },
  errorUndefined: {
    html: ['/apps/trouble/pages/error_undefined/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'errorUndefinedCtrl',
  },
  errorCable: {
    html: ['/apps/trouble/pages/error_cable/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'errorCableCtrl',
  },
  errorWIFI: {
    html: ['/apps/trouble/pages/error_wifi/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'errorWIFICtrl',
  },
  errorPPPAuth: {
    html: ['/apps/trouble/pages/error_ppp_auth/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'errorPPPAuthCtrl',
  },
  errorDHCPIPNotReceived: {
    html: ['/apps/trouble/pages/error_dhcp_ip_not_received/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'errorDHCPIPNotReceivedCtrl',
  },
  errorConnNotCreated: {
    html: ['/apps/trouble/pages/error_conn_not_created/page.tpl.html'],
    lazyDeps: [],
    ctrl: 'errorConnNotCreatedCtrl',
  },
});
