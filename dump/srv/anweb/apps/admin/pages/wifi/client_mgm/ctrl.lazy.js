'use strict';
!(function() {
  function wifiClientMgmCtrl(
    $scope,
    $state,
    $interval,
    somovd,
    funcs,
    ngDialog,
    translate,
    devinfo
  ) {
    function init() {
      function readCb(response) {
        if (!funcs.is.allRPCSuccess(response))
          return void $state.go('error', {
            code: 'pullError',
            message: 'pullErrorDesc',
          });
        var rq = response.rq;
        ($scope.supported = rq[0].data.StaListParamsAvailable),
          ($scope.clients = formClients(rq[1].data)),
          $scope.bandList.push('2.4GHz'),
          void 0 != rq[0].data['5G_Radio'] && $scope.bandList.push('5GHz'),
          $scope.$emit('pageload'),
          ($scope.isActivate = !0);
      }
      somovd.read([35, 64], readCb),
        devinfo.subscribe(
          '64',
          function(response) {
            response && updateClientsInfo(response[64]);
          },
          $scope
        );
    }
    function formClients(clients) {
      function formBand(value) {
        return '2.4 GHz' == value
          ? translate('24ghz')
          : '5 GHz' == value
            ? translate('5ghz')
            : void 0;
      }
      function formSize(value) {
        return value ? funcs.lookSize(value).toString(sizeTranslater) : '-';
      }
      function formRSSI(rssi) {
        return rssi + '%';
      }
      function formSpeed(value) {
        return value
          ? funcs
              .lookSize((1024 * value * 1024) / 8, 'bit')
              .toString(sizeTranslater) +
              '/' +
              translate('S_time_short')
          : '-';
      }
      function sizeTranslater(value) {
        return translate('size_' + value);
      }
      function formMode(value) {
        var modes = {
          '11ac': '802.11 AC',
          '11n': '802.11 N',
          '11b': '802.11 B',
          '11g': '802.11 G',
          '11a': '802.11 A',
        };
        return modes[value];
      }
      function formSleep(value) {
        var key = value ? 'wifiClientSleepOn' : 'wifiClientSleepOff';
        return translate(key);
      }
      return _.map(clients, function(client) {
        return (
          _.has(client, 'rssi') &&
            ((client.bandName = formBand(client.band)),
            (client.signal = angular.copy(client.rssi)),
            (client.rssi = formRSSI(client.rssi)),
            (client.tx_bytes = _.isUndefined(client.tx_bytes)
              ? void 0
              : formSize(client.tx_bytes)),
            (client.rx_bytes = _.isUndefined(client.rx_bytes)
              ? void 0
              : formSize(client.rx_bytes)),
            (client.lastTxRate = formSpeed(client.lastTxRate))),
          _.has(client, 'sleep') && (client.sleep = formSleep(client.sleep)),
          _.has(client, 'mode') && (client.mode = formMode(client.mode)),
          client
        );
      });
    }
    function updateClientsInfo(newInfo) {
      $scope.clients = formClients(newInfo);
    }
    function match(obj, items) {
      for (var i in items)
        if (obj.item.mac == items[i].mac)
          return (obj.item = items[i]), (obj.key = i), !0;
      return !1;
    }
    function getImgSignal(signal) {
      var value = parseInt(signal / 20);
      return (
        value || (value = '0'),
        5 == value && (value = 4),
        value ? 'wifi_' + value + ' ' : ''
      );
    }
    function showBand() {
      return $scope.bandList.length > 1;
    }
    function getMiniCaption(client) {
      return client.hostname && '' != client.hostname
        ? client.hostname
        : client.mac;
    }
    function getMiniShort(client) {
      var result = [];
      _.contains($scope.supported, 'SSID') && result.push(client.SSID),
        _.contains($scope.supported, 'band') &&
          $scope.bandList.length > 1 &&
          result.push(client.band);
      var strResult = '';
      return (
        client.hostname &&
          '' != client.hostname &&
          (strResult = strResult + client.mac + '<br>'),
        (strResult = strResult + result.join('/') + '<br>')
      );
    }
    function updateClients() {
      function readCb(response) {
        $scope.clients = formClients(response.data);
      }
      somovd.read(64, readCb);
    }
    function disconnect(items) {
      function getMacs() {
        return $scope.selectedClients.map(getMac);
      }
      function getMac(client) {
        return { mac: client.mac, band: client.band };
      }
      $scope.selectedClients = items;
      var macs = getMacs();
      somovd.write(108, macs, updateClients);
    }
    function showAllParams(item, id) {
      ngDialog
        .open({
          template: 'dialogs/wifi_client_mgm/dialog.tpl.html',
          controller: 'wifiClientMgmDialogCtrl',
          data: {
            rule: item,
            imgSignal: getImgSignal(item.signal),
            header: translate('wifiClientMgmClient') + ' ' + (parseInt(id) + 1),
          },
        })
        .closePromise.then(function() {
          updateClients();
        });
    }
    ($scope.isActivate = !1),
      ($scope.supported = null),
      ($scope.clients = []),
      ($scope.bandList = []),
      ($scope.getMiniCaption = getMiniCaption),
      ($scope.getMiniShort = getMiniShort),
      ($scope.refresh = updateClients),
      ($scope.disconnect = disconnect),
      ($scope.showAllParams = showAllParams),
      ($scope.getImgSignal = getImgSignal),
      ($scope.showBand = showBand),
      ($scope.match = match),
      init();
  }
  angular
    .module('app')
    .controllerProvider.register('wifiClientMgmCtrl', [
      '$scope',
      '$state',
      '$interval',
      'somovd',
      'funcs',
      'ngDialog',
      'translate',
      'devinfo',
      wifiClientMgmCtrl,
    ]);
})();
