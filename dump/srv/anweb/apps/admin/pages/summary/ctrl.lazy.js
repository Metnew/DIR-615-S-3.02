'use strict';
!(function() {
  function SummaryCtrl(
    $scope,
    $state,
    $parse,
    $q,
    devinfo,
    device,
    funcs,
    translate,
    cookie,
    ngDialog,
    constants,
    summaryYandexDns,
    summaryUsb,
    summaryVoip,
    somovd,
    snackbars,
    navigationFilter
  ) {
    function collectAreas(areas) {
      return _.pluck(areas, 'area').join('|');
    }
    function collectHandlers(areas) {
      _.filter(_.pluck(areas, 'handler'), function(handler) {
        return _.isFunction(handler);
      });
      return function(response) {
        _.each(areas, function(areaDesc) {
          _.isFunction(areaDesc.handler) &&
            areaDesc.handler(response, areaDesc.area);
        });
      };
    }
    function startShortAreaSummary() {
      function success(response) {
        response && collectHandlers(devinfoAreas['short'])(response),
          ($scope.pageLoadSuccess = !0);
      }
      function finallyCb() {
        shortAreas &&
          devinfo.subscribe(
            subscribeAreas['short'],
            subscribeHandlers['short'],
            $scope
          ),
          ($scope.isActivate = !0),
          $scope.$emit('pageload');
      }
      function error(msg) {
        ($scope.isActivate = !0),
          ($scope.pageLoadSuccess = !1),
          $scope.$emit('pageload');
      }
      var shortAreas = collectAreas(devinfoAreas['short']);
      devinfo
        .once(shortAreas)
        .then(success)
        ['finally'](finallyCb)
        ['catch'](error);
    }
    function startLongAreaSummary() {
      function success(response) {
        response &&
          (collectHandlers(devinfoAreas['long'])(response),
          ($scope.longAreasReady = !0));
      }
      function finallyCb() {
        longAreas &&
          devinfo.longTimeout.subscribe(
            subscribeAreas['long'],
            function(response, areas) {
              return (
                ($scope.longAreasReady = !0),
                subscribeHandlers['long'](response, areas)
              );
            },
            $scope
          );
      }
      function error(msg) {}
      var longAreas = collectAreas(devinfoAreas['long']);
      devinfo
        .once(longAreas)
        .then(success)
        ['finally'](finallyCb)
        ['catch'](error);
    }
    function longHandler(data) {
      devinfoPorts(data), devinfoClients(data);
    }
    function devinfoHandler(data) {
      function getUptimePrepared(s) {
        var result = {};
        return (
          (result.d = (s / 86400) | 0),
          (result.h = formatTimeElement(((s % 86400) / 3600) | 0)),
          (result.m = formatTimeElement(((s % 3600) / 60) | 0)),
          (result.s = formatTimeElement(s % 60)),
          result
        );
      }
      function formatTimeElement(n) {
        return n > 9 ? n : '0' + n;
      }
      function getValOrKey(obj, key) {
        return key in obj ? obj[key] : key;
      }
      function convertWan(wan) {
        if (wan) {
          var result = {
            connectionType: wan.contype,
            ip: wan.ip,
            ipv6: wan.ipv6,
          };
          return (
            wan.status &&
              ((result.status = getWanStatus(wan)),
              (result.statusDescription = wan.status
                ? 'wanStatus' + wan.status
                : '-')),
            result
          );
        }
      }
      function getWanStatus(wan) {
        return 'Connected' === wan.status
          ? 'on'
          : 'Connecting' === wan.status
            ? 'pending'
            : 'CableDisconnected' === wan.status
              ? 'disconnected'
              : 'off';
      }
      function getLookSize(num) {
        function sizeTranslater(value) {
          return translate('size_' + value);
        }
        return funcs.lookSize(num).toString(sizeTranslater);
      }
      if (data && Object.keys(data).length > 1) {
        ($scope.devInfo = {
          fw_device_id: data.modelId,
          fw_name: data.modelName,
          fw_vendor: _.isUndefined(rules.summaryReplaceVendor)
            ? data.vendor
            : rules.summaryReplaceVendor,
          fw_buildDate: data.buildDate,
          fw_buildNotes: data.buildNotes,
          fw_version: data.version,
          fw_bugs: _.isUndefined(rules.summaryReplaceMail)
            ? data.supportMail
            : rules.summaryReplaceMail,
          fw_tel: _.isUndefined(rules.summaryReplaceTel)
            ? data.supportTel
            : rules.summaryReplaceTel,
          hwRevision: data.hwRevision,
          uptimeRaw: data.uptime,
        }),
          ($scope.uptime = getUptimePrepared($scope.devInfo.uptimeRaw)),
          data.wifi_general &&
            (($scope.wifiInfo = {}),
            ['f24', 'f5'].forEach(function(freq) {
              var _broadcast = _.isBoolean(data.wifi_general[freq].broadcast),
                broadcastLed = 'on',
                broadcast = 'on';
              (!data.wifi_general[freq].radio &&
                data.wifi_general[freq].broadcast) ||
              (!data.wifi_general[freq].radio &&
                !data.wifi_general[freq].broadcast)
                ? ((broadcastLed = 'disconnected'), (broadcast = 'off'))
                : data.wifi_general[freq].radio &&
                  !data.wifi_general[freq].broadcast &&
                  ((broadcastLed = 'off'), (broadcast = 'off')),
                ($scope.wifiInfo[freq] = {
                  exists: data.wifi_general[freq].exists,
                  status: data.wifi_general[freq].radio,
                  broadcast: broadcast,
                  broadcastLed: broadcastLed,
                  guestNetCount: data.wifi_general[freq].guestNetCount,
                  statusProvider: _broadcast ? 'broadcast' : 'status',
                  ssid: data.wifi_general[freq].ssid,
                  authMode: getValOrKey(
                    authModes,
                    data.wifi_general[freq].authMode
                  ),
                });
            })),
          ($scope.wanInfo = {
            v4: convertWan(data.ipv4gw),
            v6: convertWan(data.ipv6gw),
          }),
          ($scope.lanInfo = $scope.lanInfo || {}),
          ($scope.lanInfo.lanIp = data.lan ? data.lan[0].ip : ''),
          ($scope.lanInfo.lanIpv6 = data.lan ? data.lan[0].ipv6 : '');
        var infoCPURAM = data[constants.CPU_AND_RAM];
        if (infoCPURAM) {
          if (
            (($scope.cpuram = { cpu: null, ram: null, isActivate: !1 }),
            !_.isUndefined(infoCPURAM.cpu))
          ) {
            var oldCPU = __backup.cpu || infoCPURAM.cpu;
            if (infoCPURAM.cpu.cpu_total_raw_32) {
              var totalRam = Math.abs(
                  infoCPURAM.cpu.cpu_total_raw_32 - oldCPU.cpu_total_raw_32
                ),
                busyRam = Math.abs(
                  infoCPURAM.cpu.cpu_busy_raw_32 - oldCPU.cpu_busy_raw_32
                ),
                loadCpu = totalRam ? Math.round((busyRam / totalRam) * 100) : 0;
              $scope.cpuram.cpu = 100 > loadCpu ? loadCpu : '100';
            } else $scope.cpuram.cpu = infoCPURAM.cpu;
            ($scope.cpuram.cpuString = $scope.cpuram.cpu + '%'),
              (__backup.cpu = infoCPURAM.cpu),
              ($scope.cpuram.isActivate = !0);
          }
          if (!_.isUndefined(infoCPURAM.ram)) {
            var ramTotal = infoCPURAM.ram.totalram,
              ramBuf = infoCPURAM.ram.bufferram,
              ramShared = infoCPURAM.ram.sharedram,
              ramFree = infoCPURAM.ram.freeram + ramShared,
              ramUsed = ramTotal - ramFree - ramShared - ramBuf,
              ram = { rate: {}, string: {} };
            (ram.rate.used = Math.round((ramUsed / ramTotal) * 100)),
              (ram.string.used =
                ram.rate.used + '% (' + getLookSize(ramUsed) + ')'),
              (ram.string.free = getLookSize(ramFree)),
              (ram.string.buf = getLookSize(ramBuf)),
              (ram.string.shared = getLookSize(ramShared)),
              (ram.string.total = getLookSize(ramTotal)),
              ($scope.cpuram.ram = ram),
              ($scope.cpuram.isActivate = !0);
          }
        }
      }
    }
    function devinfoClients(data) {
      data &&
        Object.keys(data).length > 1 &&
        (($scope.lanInfo = $scope.lanInfo || {}),
        ($scope.lanInfo.numberOfWirelessClients = data.numberOfWirelessClients),
        ($scope.lanInfo.numberOfWiredClients = data.numberOfWiredClients));
    }
    function devinfoPorts(data) {
      function getPortInfo(port) {
        var num = /\d+$/.exec(port.name),
          name = '';
        return (
          (name = port.alias
            ? port.alias
            : num
              ? 'LAN' + num
              : port.name && port.name.toUpperCase()),
          {
            name: name,
            status: !!port.status,
            management: !!port.management,
            speed: port.speed ? port.speed : '',
          }
        );
      }
      function isUseSpeed(lanPorts) {
        return _.some(lanPorts, function(port) {
          return _.has(port, 'speed');
        });
      }
      function getLanPorts(availPorts) {
        return availPorts.filter(isLanPort);
      }
      function isLanPort(port) {
        return (
          !port.isWan && ('ethernet' === port.type || 'fiber' === port.type)
        );
      }
      if (data && Object.keys(data).length > 1) {
        var lanPorts = getLanPorts(data.availPorts);
        ($scope.lanInfo = $scope.lanInfo || {}),
          ($scope.lanInfo.ports = _.sortBy(
            _.map(lanPorts, getPortInfo),
            'name'
          )),
          ($scope.lanInfo.isUseSpeed = isUseSpeed(lanPorts)),
          ($scope.lanInfo.notPortsInfo =
            !_.has(data, 'availPorts') || (lanPorts && 0 == lanPorts.length));
      }
    }
    function deviceModeHandler(data) {
      ($scope.hasHWModeSwitch = $parse(
        'd[' + constants.DEVICE_MODE_RPC + '].devmode_hw_switch_support'
      )({ d: data })),
        constants.LEDS_DISABLE_SUPPORT &&
          (($scope.ledsEnable = $parse(
            'd[' + constants.DEVICE_MODE_RPC + '].leds_enable'
          )({ d: data })),
          _.isUndefined($scope.ledsEnable) && ($scope.ledsEnable = !0));
    }
    function gponStatusHandler(data) {
      $scope.onuState = $parse(
        'd[' + constants.GPON_STATUS_RPC + '].onu_state'
      )({ d: data });
    }
    function dslStatusHandler(data) {
      $scope.dslStats = $parse(
        'd[' + constants.DSL_RPC + '].adslTrainingState'
      )({ d: data });
    }
    (window.devinfo = devinfo), ($scope.constants = constants);
    var rules = navigationFilter.rules(),
      __backup = {},
      authModes = {
        OPEN: 'Open',
        SHARED: 'Shared',
        WPA: 'WPA',
        WPAPSK: 'WPA-PSK',
        WPA2: 'WPA2',
        WPA2PSK: 'WPA2-PSK',
        WPA1WPA2: 'WPA/WPA2 mixed',
        WPAPSKWPA2PSK: 'WPA-PSK/WPA2-PSK mixed',
      },
      devinfoAreas = { short: [], long: [] };
    devinfoAreas['short'].push({
      area: constants.CPU_AND_RAM + '|version|wifi_general|net',
      handler: devinfoHandler,
      subscribe: !0,
    }),
      devinfoAreas['short'].push({
        area: '' + constants.DEVICE_MODE_RPC,
        handler: deviceModeHandler,
      }),
      constants.GPON_SUPPORT &&
        devinfoAreas['short'].push({
          area: '' + constants.GPON_STATUS_RPC,
          handler: gponStatusHandler,
          subscribe: !0,
        }),
      constants.DSL_STATUS &&
        devinfoAreas['short'].push({
          area: '' + constants.DSL_RPC,
          handler: dslStatusHandler,
          subscribe: !0,
        }),
      constants.YANDEX_DNS_SUPPORT &&
        (($scope.yandexInfo = summaryYandexDns.get()),
        devinfoAreas['long'].push({
          area: $scope.yandexInfo.area,
          handler: $scope.yandexInfo.devinfoHandler,
          subscribe: !0,
        })),
      devinfoAreas['long'].push({
        area: 'clients|ports',
        handler: longHandler,
        subscribe: !0,
      }),
      (constants.DONGLE_SUPPORT || constants.STORAGE_SUPPORT) &&
        (($scope.usbInfo = summaryUsb.get()),
        devinfoAreas['long'].push({
          area: $scope.usbInfo.area,
          handler: $scope.usbInfo.devinfoHandler,
          subscribe: !0,
        })),
      constants.VOIP_SUPPORT &&
        (($scope.voipInfo = summaryVoip.get()),
        devinfoAreas['short'].push({
          area: $scope.voipInfo.areas,
          handler: $scope.voipInfo.devinfoHandler,
          subscribe: !0,
        })),
      (function() {
        var mode = cookie.get('device_mode'),
          modesList = { ap: 'extender', router: 'router' };
        $scope.deviceMode = mode in modesList ? modesList[mode] : null;
      })(),
      devinfo.init({ min_interval: 4, timeout: 5e3 });
    var subscribeAreaDescriptions = {},
      subscribeAreas = {},
      subscribeHandlers = {};
    _.each(devinfoAreas, function(areas, name) {
      (subscribeAreaDescriptions[name] = _.where(devinfoAreas[name], {
        subscribe: !0,
      })),
        (subscribeAreas[name] = collectAreas(subscribeAreaDescriptions[name])),
        (subscribeHandlers[name] = collectHandlers(
          subscribeAreaDescriptions[name]
        ));
    }),
      startShortAreaSummary(),
      startLongAreaSummary(),
      ($scope.refreshSummary = function() {
        $state.go($state.current, {}, { reload: !0 });
      }),
      ($scope.openModeDialog = function() {
        var content =
          'device_mode_info_' +
          ($scope.hasHWModeSwitch ? 'hw_switch_' : '') +
          $scope.deviceMode;
        ngDialog.open({
          template: 'dialogs/modal_info/dialog.tpl.html',
          className: 'modal_info_dialog',
          controller: 'ModalInfoCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/modal_info/ctrl.lazy.js',
            'ModalInfoCtrl'
          ),
          data: {
            header: 'device_mode',
            content:
              '<div nw-bind-html-compile="\'' +
              content +
              '\' | translate"></div>',
          },
        });
      }),
      ($scope.openCpuMemoryDialog = function() {
        ngDialog.open({
          template: 'dialogs/cpu_memory_statistic/dialog.tpl.html',
          className: 'cpu_memory_info_dialog',
          controller: 'CpuMemoryCtrl',
          resolve: funcs.getLazyResolve(
            'dialogs/cpu_memory_statistic/ctrl.lazy.js',
            'CpuMemoryCtrl'
          ),
          scope: $scope,
        });
      }),
      ($scope.changeLedsDisable = function(ledsEnable) {
        somovd
          .write(constants.DEVICE_MODE_RPC, { leds_enable: ledsEnable })
          .then(
            function(a) {
              return snackbars.add('rpc_write_success');
            },
            function(a) {
              return snackbars.add('rpc_write_error');
            }
          );
      });
  }
  function trimLetters(value, start, end) {
    if (!_.isString(value)) return value;
    var output = value;
    if (start) {
      var r = new RegExp('^' + start + '+', 'g');
      output = output.replace(r, '');
    }
    if (end) {
      var r = new RegExp(end + '+$', 'g');
      output = output.replace(r, '');
    }
    return output;
  }
  angular
    .module('app')
    .controllerProvider.register('SummaryCtrl', [
      '$scope',
      '$state',
      '$parse',
      '$q',
      'devinfo',
      'device',
      'funcs',
      'translate',
      'cookie',
      'ngDialog',
      'summaryConstants',
      'summaryYandexDns',
      'summaryUsb',
      'summaryVoip',
      'somovd',
      'snackbars',
      'navigationFilter',
      SummaryCtrl,
    ]),
    angular
      .module('app')
      .filterProvider.register('replaceHtmlEntities', function() {
        return function(input) {
          var replace = { '&nbsp;': ' ' },
            output = input;
          for (var key in replace) output = output.replace(key, replace[key]);
          return output;
        };
      }),
    angular.module('app').filterProvider.register('trimLetters', function() {
      return trimLetters;
    });
})();
