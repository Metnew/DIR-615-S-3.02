'use strict';
angular.module('app').constant('ddnsConstants', {
  ddns: 6,
  ifaces: 120,
  services: [
    {
      Name: 'DLinkDDNS',
      Service: 'dlinkddns.com',
      System: 'dyndns@dyndns.org',
    },
    {
      Name: 'DynDNS.com',
      Service: 'dyndns.com',
      System: 'dyndns@dyndns.org',
    },
    { Name: 'NoIP', Service: 'no-ip.com', System: 'default@no-ip.com' },
  ],
});
