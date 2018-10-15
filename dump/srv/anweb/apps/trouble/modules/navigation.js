'use strict';
!(function() {
  angular.module(regdep('navigation'), []).constant('navigation', {
    wait: { page: 'wait', url: '/wait', buttons: [] },
    connected: {
      page: 'connected',
      url: '/connected',
      buttons: ['exit_to_site', 'exit_to_admin'],
    },
    failed: {
      page: 'failed',
      url: '/failed',
      buttons: ['exit_to_admin', 'recheck'],
    },
    error_undefined: {
      page: 'errorUndefined',
      url: '/error_undefined',
      buttons: ['exit_to_admin', 'recheck'],
    },
    error_cable: {
      page: 'errorCable',
      url: '/error_cable',
      buttons: ['exit_to_admin', 'recheck'],
    },
    error_dongle_not_inserted: {
      page: 'errorDongleNotInserted',
      url: '/error_dongle_not_inserted',
      buttons: ['recheck'],
    },
    error_dongle_pin: {
      page: 'errorDonglePin',
      url: '/error_dongle_pin',
      buttons: ['exit_to_admin', 'apply'],
    },
    error_dongle_sim_not_inserted: {
      page: 'errorDongleSimNotInserted',
      url: '/error_dongle_sim_not_inserted',
      buttons: ['recheck'],
    },
    error_ppp_auth: {
      page: 'errorPPPAuth',
      url: '/error_ppp_auth',
      buttons: ['exit_to_admin', 'apply'],
    },
    error_wifi: {
      page: 'errorWIFI',
      url: '/error_wifi',
      buttons: ['exit_to_admin', 'recheck'],
    },
    error_dhcp_ip_not_received: {
      page: 'errorDHCPIPNotReceived',
      url: '/error_dhcp_ip_not_received',
      buttons: ['exit_to_admin', 'recheck'],
    },
    error_conn_not_created: {
      page: 'errorConnNotCreated',
      url: '/error_conn_not_created',
      buttons: ['exit_to_admin'],
    },
  });
})();
