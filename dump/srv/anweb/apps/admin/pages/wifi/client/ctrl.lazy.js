'use strict';
!(function() {
  function wifiClientCtrl(
    $scope,
    $state,
    $q,
    translate,
    ngDialog,
    devinfo,
    $timeout,
    constant
  ) {
    function activate() {
      function success() {
        activateRadio(),
          activateAP(),
          activateClient(),
          checkWDSActivate(),
          $scope.isWDSActivate ||
            (($scope.isActivate = !0),
            constant.autoScan && startHiddenUpdate()),
          $scope.$emit('pageload');
      }
      function startHiddenUpdate() {
        function wait() {
          hiddenTimeout = $timeout(startHiddenUpdate, 1e4);
        }
        $scope.wifiClient.scanLoading || $scope.ep.data.Enable
          ? wait()
          : updateScanList()['finally'](function() {
              return wait();
            });
      }
      pullClient()
        .then(success)
        ['catch'](pullError);
    }
    function activateRadio() {
      device.wifi.hasBand('2.4GHz') &&
        ($scope.radio = device.wifi.getBand(0, '2.4GHz').radio),
        device.wifi.hasBand('5GHz') &&
          ($scope.radio5G = device.wifi.getBand(0, '5GHz').radio);
    }
    function activateAP() {
      device.wifi.hasBand('2.4GHz') &&
        ($scope.ap = device.wifi.getBand(0, '2.4GHz').ap.getBase()),
        device.wifi.hasBand('5GHz') &&
          ($scope.ap5G = device.wifi.getBand(0, '5GHz').ap.getBase());
    }
    function checkWDSActivate() {
      var wds = device.wifi.getWDSData();
      $scope.isWDSActivate = wds && 'Disabled' != wds.Mode;
    }
    function pullClient() {
      function pullClientCb(error) {
        return error
          ? void deferred.reject(error)
          : (($scope.isSeparateClient = device.wifi.isSeparateClient()),
            ($scope.bandParams = {}),
            ($scope.warnings.length = 0),
            $scope.isSeparateClient &&
              ($scope.band.list.length ||
                ($scope.band.list = device.wifi.getClientBands()),
              $scope.band.state ||
                ($scope.band.state = $state.params.freq
                  ? $state.params.freq
                  : _.first($scope.band.list))),
            device.wifi.hasBand('2.4GHz') ||
              ($scope.bandParams['2.4GHz'] = 'unsupported'),
            device.wifi.hasBand('5GHz') ||
              ($scope.bandParams['5GHz'] = 'unsupported'),
            device.wifi.hasBand('2.4GHz') &&
              !device.wifi.isRadioEnable('2.4GHz') &&
              (($scope.bandParams['2.4GHz'] = 'disabled'),
              $scope.warnings.push(
                device.wifi.hasBand('5GHz')
                  ? 'radio_24GHz_disabled'
                  : 'radio_disabled'
              )),
            device.wifi.hasBand('5GHz') &&
              !device.wifi.isRadioEnable('5GHz') &&
              (($scope.bandParams['5GHz'] = 'disabled'),
              $scope.warnings.push('radio_5GHz_disabled')),
            void deferred.resolve($scope.bandParams));
      }
      var deferred = $q.defer();
      return device.wifi.pullClient(pullClientCb), deferred.promise;
    }
    function pullScan() {
      var deferred = $q.defer(),
        rpcList = [];
      return (
        rpcList.push(constants.CONFIG_ID_WIFI_SCAN),
        rpcList.push(constants.CONFIG_ID_WIFI_SCAN_5G),
        ($scope.wifiClient.scanLoading = !0),
        devinfo.once(rpcList.join('|'), { timeout: 6e4 }).then(function(data) {
          var data = _.pick(data, _.values(rpcList));
          data && device.wifi.updateScan(data),
            ($scope.wifiClient.scanLoading = !1),
            deferred.resolve();
        }),
        deferred.promise
      );
    }
    function pullError() {
      $state.go('error', { code: 'pullError', message: 'pullErrorDesc' }),
        $scope.$emit('pageload');
    }
    function activateClient() {
      updateClientData(),
        ($scope.ep.ConnectMode = 'select'),
        ($scope.ep.sortDirection = 'desc'),
        ($scope.ep.sortActive = 'SignalStrength');
    }
    function activateScanList() {
      ($scope.wifiClient.scanList = device.wifi.scanList($scope.band.state)),
        $scope.sortBy($scope.ep.sortActive);
    }
    function startUpdateClientStatus() {
      devinfo.subscribe(
        '35',
        function(data) {
          data[35] &&
            (data[35].apcli || data[35]['5G_apcli']) &&
            ($scope.ep.Connect =
              '5GHz' == $scope.band.state
                ? data[35]['5G_apcli'].ApCliConnect
                : data[35].apcli.ApCliConnect);
        },
        $scope
      );
    }
    function updateScanList() {
      return $scope.wifiClient.scanLoading
        ? void 0
        : pullScan().then(activateScanList);
    }
    function updateClientData() {
      var band = $scope.band.state ? $scope.band.state : '2.4GHz';
      ($scope.client = device.wifi.getClient(band)),
        ($scope.ep.data = $scope.client.getBase()),
        ($scope.ep.Connect = !!$scope.ep.data.Connect),
        $scope.ep.data.Enable &&
          $scope.ep.data.SSID &&
          '' != $scope.ep.data.SSID &&
          startUpdateClientStatus(),
        onEnable($scope.ep.data.Enable);
    }
    function enableRadio(band) {
      device.wifi.enableRadio(band, activate);
    }
    function hasWarning(name) {
      return name ? _.contains($scope.warnings, name) : $scope.warnings.length;
    }
    function isSelectMode() {
      return (
        (device.wifi.hasBand('2.4GHz') &&
          device.wifi.isRadioEnable('2.4GHz')) ||
        (device.wifi.hasBand('5GHz') && device.wifi.isRadioEnable('5GHz'))
      );
    }
    function changeBand(freq) {
      isFormInvalid() ||
        (($scope.wifiClient.changingBand = !0),
        $timeout(function() {
          $scope.wifiClient.changingBand = !1;
        }, 100),
        ($scope.band.state = freq),
        updateClientData(),
        activateScanList(),
        $state.go('.', { freq: freq }, { notify: !1 }));
    }
    function getSelectedClass(item) {
      return $scope.ep.data
        ? _.isUndefined($scope.ep.data.BSSID)
          ? ''
          : $scope.ep.data.BSSID.toUpperCase() == item.BSSID.toUpperCase() &&
            $scope.ep.data.Band == item.Band
            ? 'selected-main'
            : ''
        : '';
    }
    function selectEndpoint(index, event) {
      function startDialog(options) {
        return ngDialog.open({
          template: 'dialogs/wifi_client/dialog.tpl.html',
          controller: 'WifiClientDialogCtrl',
          scope: $scope,
          data: options,
        });
      }
      function closeDialog(result) {
        if (result && result.value) {
          if ((_.extend($scope.ep.data, result.value.ep), result.value.radio)) {
            var dataRadio = result.value.radio,
              bandRadio =
                '5GHz' == dataRadio.Band ? $scope.radio5G : $scope.radio;
            dataRadio.Channel &&
              ((bandRadio.AutoChannelEnable = !1),
              (bandRadio.Channel = dataRadio.Channel));
          }
          $scope.apply();
        }
      }
      var options = (angular.copy($scope.wifiClient.scanList[index]),
      {
        pointData: angular.copy($scope.wifiClient.scanList[index]),
        clientData: angular.copy($scope.ep.data),
      });
      startDialog(options).closePromise.then(closeDialog);
    }
    function changeConnectMode(value) {
      'manual' == value
        ? (($scope.backupTemplate = angular.copy($scope.ep.data)),
          $scope.ep.data.Security.DefaultKeyID ||
            ($scope.ep.data.Security.DefaultKeyID = '1'),
          $scope.ep.data.Security.EncryptionType ||
            ($scope.ep.data.Security.EncryptionType = 'None'),
          $scope.ep.data.Security.OpenWEPType ||
            ($scope.ep.data.Security.OpenWEPType = 'WEP-64'),
          (encryptWatcher = $scope.$watch(
            $scope.getEncrypTypes,
            changeEncrypType,
            !0
          )))
        : (_.extend($scope.ep.data, angular.copy($scope.backupTemplate)),
          ($scope.backupTemplate = null),
          encryptWatcher && encryptWatcher());
    }
    function changeEncrypType(types) {
      if (types && $scope.ep.data) {
        var encr = $scope.ep.data.Security.EncryptionType;
        _.contains(types, encr) ||
          ($scope.ep.data.Security.EncryptionType = types[0]);
      }
    }
    function isFormInvalid() {
      return $scope.form && $scope.form.$invalid;
    }
    function onEnable(value) {
      !constant.autoScan && $scope.ep.data.Enable && updateScanList();
    }
    var hiddenTimeout,
      device = $scope.device,
      helper = device.wifi.helper,
      constants = { CONFIG_ID_WIFI_SCAN: 133, CONFIG_ID_WIFI_SCAN_5G: 185 };
    ($scope.isActivate = !1),
      ($scope.isWDSActivate = !1),
      ($scope.client = null),
      ($scope.radio = null),
      ($scope.radio5G = null),
      ($scope.ap = null),
      ($scope.ap5G = null),
      ($scope.ep = {}),
      ($scope.backup = {}),
      ($scope.onEnable = onEnable),
      ($scope.warnings = []),
      ($scope.hasWarning = hasWarning),
      ($scope.enableRadio = enableRadio),
      ($scope.band = { list: [], state: null, change: changeBand }),
      ($scope.wifiClient = {
        updateScanList: updateScanList,
        isSelectMode: isSelectMode,
        scanList: [],
        selectEndpoint: selectEndpoint,
        getSelectedClass: getSelectedClass,
      }),
      $scope.$on('$destroy', function() {
        hiddenTimeout && $timeout.cancel(hiddenTimeout);
      }),
      activate(),
      constant.autoScan && updateScanList(),
      ($scope.supportedBroadcast = function(freq) {
        var ap = '2.4GHz' == freq ? $scope.ap : $scope.ap5G;
        return ap && _.has(ap, 'Broadcast');
      }),
      ($scope.supportedMacAddressClone = function() {
        if (!constant.supportMacClone) return !1;
        var broadcast24 = !$scope.ap || _.has($scope.ap, 'Broadcast'),
          broadcast5 = !$scope.ap5G || _.has($scope.ap5G, 'Broadcast');
        return (
          _.has($scope.ep.data, 'MacAddressClone') && broadcast24 && broadcast5
        );
      }),
      ($scope.disabledMacAddressClone = function() {
        return $scope.ap && $scope.ap.Broadcast
          ? !0
          : $scope.ap5G && $scope.ap5G.Broadcast
            ? !0
            : !1;
      }),
      ($scope.showBroadcast = function(freq) {
        return $scope.band.state ? $scope.band.state == freq : !0;
      }),
      ($scope.enableBroadcast = function(freq) {
        $scope.supportedMacAddressClone() &&
          $scope.disabledMacAddressClone() &&
          (($scope.ep.data.MacAddressClone.Mode = 'off'),
          ($scope.ep.data.MacAddressClone.Address = ''));
      }),
      ($scope.sortBy = function(field) {
        function sortByFieldDesc(field) {
          return function(x, y) {
            return x.BSSID === $scope.ep.data.BSSID
              ? -1
              : y.BSSID === $scope.ep.data.BSSID
                ? 1
                : 'Channel' == field || 'SignalStrength' == field
                  ? parseInt(x[field]) < parseInt(y[field])
                    ? 1
                    : -1
                  : x[field].toLowerCase() < y[field].toLowerCase()
                    ? 1
                    : -1;
          };
        }
        $scope.wifiClient.scanList.sort(sortByFieldDesc(field));
      }),
      ($scope.getSecurityInfo = function(security) {
        var result = '',
          mode = security.ModeEnabled;
        switch (mode) {
          case 'None':
          case 'WEP':
            result += 'Open';
            break;
          case 'WPA-Enterprise':
            result += 'WPA';
            break;
          case 'WPA2-Enterprise':
            result += 'WPA2';
            break;
          case 'WPA-WPA2-Enterprise':
            result += 'WPA/WPA2 mixed';
            break;
          case 'WPA-Personal':
            result += 'WPA-PSK';
            break;
          case 'WPA2-Personal':
            result += 'WPA2-PSK';
            break;
          case 'WPA-WPA2-Personal':
            result += 'WPA-PSK/WPA2-PSK mixed';
            break;
          default:
            result += 'UNKNOWN';
        }
        return result;
      }),
      ($scope.getNotAvailStatus = function() {
        if (0 == $scope.wifiClient.scanList.length) return '';
        var availNet = _.find($scope.wifiClient.scanList, function(elem) {
          return (
            elem.BSSID == $scope.ep.data.BSSID &&
            elem.Band == $scope.ep.data.Band
          );
        });
        return availNet ? '' : ' (' + translate('wifiClientOutOfRange') + ')';
      }),
      ($scope.getFreq = function(band) {
        return '2.4GHz' == band
          ? translate('24ghz')
          : '5GHz' == band
            ? translate('5ghz')
            : '';
      });
    var encryptWatcher;
    $scope.$watch('ep.ConnectMode', changeConnectMode),
      ($scope.supportedModes = function() {
        function getTempModes() {
          var tempM = [
            { name: 'Open', value: 'None' },
            { name: 'WEP-64', value: 'WEP-64' },
            { name: 'WEP-128', value: 'WEP-128' },
            { name: 'WPA-PSK', value: 'WPA-Personal' },
            { name: 'WPA2-PSK', value: 'WPA2-Personal' },
            { name: 'WPA-PSK/WPA2-PSK mixed', value: 'WPA-WPA2-Personal' },
          ];
          return tempM;
        }
        var ModesTemplate = getTempModes(),
          ModesSupported = $scope.ep.data.Security.ModesSupported.split(',');
        return _.filter(ModesTemplate, function(obj) {
          return _.indexOf(ModesSupported, obj.value) + 1 ? !0 : !1;
        });
      }),
      ($scope.getDefaultKeysID = function() {
        return helper.getDefaultKeysID();
      }),
      ($scope.getWEPTypes = function() {
        return helper.getWEPTypes();
      }),
      ($scope.getEncrypTypes = function() {
        return helper.getEncrypTypes($scope.ep.data);
      }),
      ($scope.showSecurity = function(type) {
        return helper.checkSecurityType(type, $scope.ep.data);
      }),
      ($scope.validPSKKey = function(pskKey) {
        return helper.validPSKKey(pskKey);
      }),
      ($scope.getWEPKeyLenMessage = function() {
        return $scope.ep ? helper.getWEPKeyLenMessage($scope.ep.data) : null;
      }),
      ($scope.validWEPKey = function(wepKey) {
        return $scope.ep ? helper.validWEPKey(wepKey, $scope.ep.data) : null;
      }),
      ($scope.apply = function() {
        isFormInvalid() ||
          ($scope.$emit('unsavewWarningStopWatch'),
          device.wifi.push(function(error) {
            error
              ? $state.go('error', {
                  code: 'pushError',
                  message: 'pushErrorDesc',
                })
              : $state.go($state.current, {}, { reload: !0 });
          }));
      }),
      ($scope.wasModifed = function() {
        return $scope.isActivate && device.wifi.isChange();
      });
  }
  angular
    .module('app')
    .controllerProvider.register('wifiClientCtrl', [
      '$scope',
      '$state',
      '$q',
      'translate',
      'ngDialog',
      'devinfo',
      '$timeout',
      'wifiClientConstants',
      wifiClientCtrl,
    ]);
})();
