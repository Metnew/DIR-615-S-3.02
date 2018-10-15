'use strict';
angular.module('app').service('raccessConfig', function() {
  var defined = {
    ertelecom: 'undefined' != typeof ERTELECOM,
    telnet: !0,
    https: !0,
    ftp: 'undefined' != typeof BR2_PACKAGE_ANWEB_FTP,
    samba: 'undefined' != typeof BR2_PACKAGE_ANWEB_SAMBA,
    bcm: 'undefined' != typeof BCM,
    rlx_modem: !0 && 'undefined' != typeof BR2_modems,
    ralink_modem: 'undefined' != typeof RALINK_MODEM,
    https_support: !0,
  };
  defined.bcm_rlx_ralink =
    defined.bcm || defined.rlx_modem || defined.ralink_modem;
  var protocols = [];
  protocols.push({ name: 'HTTP', value: defined.ertelecom ? '8080' : '80' }),
    defined.https && protocols.push({ name: 'HTTPS', value: '443' }),
    defined.bcm_rlx_ralink && protocols.push({ name: 'ICMP', value: '99' }),
    defined.ftp && protocols.push({ name: 'FTP', value: '21' }),
    defined.telnet && protocols.push({ name: 'TELNET', value: '23' }),
    defined.samba && protocols.push({ name: 'SMB', value: '445' });
  var system_ports = [];
  return (
    'undefined' != typeof BR2_PACKAGE_ANWEB_CUSTOM_GOODLINE_21218 &&
      (system_ports.push('64010'), system_ports.push('61040')),
    { defined: defined, protocols: protocols, system_ports: system_ports }
  );
});
