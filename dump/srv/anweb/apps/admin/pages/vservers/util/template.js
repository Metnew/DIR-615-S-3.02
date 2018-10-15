'use strict';
!(function() {
  function vserversTemplate(consts) {
    var list = [
      {
        Name: 'Custom',
        Type: 'custom',
        ProtocolList: ['TCP', 'UDP', 'TCP/UDP'],
        Source: { Ports: { 1: { Start: '', End: '' } } },
        Dest: { Ports: { 1: { Start: '', End: '' } } },
      },
      {
        Name: 'HTTP',
        Type: 'http',
        ProtocolList: ['TCP'],
        Source: { Ports: { 1: { Start: '80', End: '' } } },
        Dest: { Ports: { 1: { Start: '80', End: '' } } },
      },
      {
        Name: 'HTTPS',
        Type: 'https',
        ProtocolList: ['TCP'],
        Source: { Ports: { 1: { Start: '443', End: '' } } },
        Dest: { Ports: { 1: { Start: '443', End: '' } } },
      },
      {
        Name: 'DNS',
        Type: 'dns',
        ProtocolList: ['UDP'],
        Source: { Ports: { 1: { Start: '53', End: '' } } },
        Dest: { Ports: { 1: { Start: '53', End: '' } } },
      },
      {
        Name: 'SMTP',
        Type: 'smtp',
        ProtocolList: ['TCP'],
        Source: { Ports: { 1: { Start: '25', End: '' } } },
        Dest: { Ports: { 1: { Start: '25', End: '' } } },
      },
      {
        Name: 'POP3',
        Type: 'pop3',
        ProtocolList: ['TCP'],
        Source: { Ports: { 1: { Start: '110', End: '' } } },
        Dest: { Ports: { 1: { Start: '110', End: '' } } },
      },
      {
        Name: 'SSH',
        Type: 'ssh',
        ProtocolList: ['TCP'],
        Source: { Ports: { 1: { Start: '22', End: '' } } },
        Dest: { Ports: { 1: { Start: '22', End: '' } } },
      },
      {
        Name: 'FTP',
        Type: 'ftp',
        ProtocolList: ['TCP'],
        Source: { Ports: { 1: { Start: '20', End: '21' } } },
        Dest: { Ports: { 1: { Start: '20', End: '21' } } },
      },
      {
        Name: 'SFTP',
        Type: 'sftp',
        ProtocolList: ['TCP'],
        Source: { Ports: { 1: { Start: '', End: '' } } },
        Dest: { Ports: { 1: { Start: '', End: '' } } },
      },
      {
        Name: 'Telnet',
        Type: 'telnet',
        ProtocolList: ['TCP', 'UDP', 'TCP/UDP'],
        Source: { Ports: { 1: { Start: '23', End: '' } } },
        Dest: { Ports: { 1: { Start: '23', End: '' } } },
      },
      {
        Name: 'PPTP',
        Type: 'pptp',
        ProtocolList: ['TCP', 'UDP', 'TCP/UDP'],
        Source: { Ports: { 1: { Start: '1723', End: '' } } },
        Dest: { Ports: { 1: { Start: '1723', End: '' } } },
      },
      {
        Name: 'PCAnyWhere',
        Type: 'pcanywhere',
        ProtocolList: ['TCP/UDP'],
        Source: { Ports: { 1: { Start: '', End: '' } } },
        Dest: { Ports: { 1: { Start: '', End: '' } } },
      },
      {
        Name: 'VNC',
        Type: 'vnc',
        ProtocolList: ['TCP', 'UDP', 'TCP/UDP'],
        Source: { Ports: { 1: { Start: '5900', End: '' } } },
        Dest: { Ports: { 1: { Start: '5900', End: '' } } },
      },
      {
        Name: 'TFTP',
        Type: 'tftp',
        ProtocolList: ['UDP'],
        Source: { Ports: { 1: { Start: '69', End: '' } } },
        Dest: { Ports: { 1: { Start: '69', End: '' } } },
      },
      {
        Name: 'RDP',
        Type: 'rdp',
        ProtocolList: ['TCP', 'UDP', 'TCP/UDP'],
        Source: { Ports: { 1: { Start: '3389', End: '' } } },
        Dest: { Ports: { 1: { Start: '3389', End: '' } } },
      },
    ];
    return (
      consts.GOODLINE &&
        (list.push({
          Name: 'OGO-UDP',
          Type: 'ogo-udp',
          ProtocolList: ['UDP'],
          Source: { Ports: { 1: { Start: '6308', End: '' } } },
          Dest: { Ports: { 1: { Start: '6308', End: '' } } },
        }),
        list.push({
          Name: 'OGO-TCP',
          Type: 'ogo-tcp',
          ProtocolList: ['TCP'],
          Source: { Ports: { 1: { Start: '10853', End: '' } } },
          Dest: { Ports: { 1: { Start: '10853', End: '' } } },
        })),
      list
    );
  }
  angular
    .module('app')
    .service('vserversTemplate', ['vserversConstants', vserversTemplate]);
})();
