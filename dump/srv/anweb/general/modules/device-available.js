'use strict';
!(function() {
  var deviceAvailableModule = angular.module(regdep('deviceAvailable'), [
      'devinfo',
    ]),
    deviceAvailable = function() {
      return (
        (this.getNotAvailableCallback = null),
        (this.getAvailableAgainCallback = null),
        (this.getMACAddressChangeCallback = null),
        (this.getNotAvailableCountCallback = null),
        (this.getAvailableCountCallback = null),
        (this.$get = [
          '$injector',
          '$http',
          '$timeout',
          'deviceAvailableInfo',
          'deviceMacInfo',
          function($injector, $http, $timeout, available, mac) {
            function init(options) {
              settings = _.extend(settings, options);
            }
            function start() {
              (wasStarted = !0), __pull();
            }
            function stop() {
              (wasStarted = !1), available.clean();
            }
            function complete() {
              (wasStarted = !1),
                available.clean(),
                $injector.invoke(providerObj.getAvailableAgainCallback, null, {
                  deviceAvailableMode: mode,
                });
            }
            function setMode(name) {
              (mode = name), (availableCount = 0), (notAvailableCount = 0);
            }
            function request() {
              var url = settings.url + '?&_=' + _.random(1e4, 99999),
                opts = { timeout: settings.timeout };
              return $http.get(url, opts);
            }
            function __pull() {
              function success(response) {
                if (_.isString(response) && 'fwupdate.local' == mode)
                  console.log('old fw detected');
                else if (!response || !response.error || !response.error.code)
                  return void error();
                __monitoring({}), refresh();
              }
              function error() {
                __monitoring(null, 'pull error'), refresh();
              }
              function refresh() {
                $timeout(function() {
                  (activeTimer = !1), __pull();
                }, settings.interval);
              }
              wasStarted &&
                (activeTimer ||
                  ((activeTimer = !0),
                  request()
                    .success(success)
                    .error(error)));
            }
            function __monitoring(data, error) {
              wasStarted && (available.update(data, error), __analyze(data));
            }
            function __analyze(data) {
              var availableStatus = available.getStatus(),
                availableState = available.getState();
              availableStatus
                ? ((notAvailableCount = 0),
                  'device_available_again' == availableState &&
                    $injector.invoke(
                      providerObj.getAvailableAgainCallback,
                      null,
                      { deviceAvailableMode: mode }
                    ),
                  availableCount++,
                  providerObj.getAvailableCountCallback &&
                    $injector.invoke(
                      providerObj.getAvailableCountCallback,
                      null,
                      {
                        deviceAvailableMode: mode,
                        deviceAvailableCount: availableCount,
                      }
                    ))
                : ((availableCount = 0),
                  'device_become_unavailable' == availableState &&
                    $injector.invoke(
                      providerObj.getNotAvailableCallback,
                      null,
                      { deviceAvailableMode: mode }
                    ),
                  notAvailableCount++,
                  providerObj.getNotAvailableCountCallback &&
                    $injector.invoke(
                      providerObj.getNotAvailableCountCallback,
                      null,
                      {
                        deviceAvailableMode: mode,
                        deviceNotAvailableCount: notAvailableCount,
                      }
                    ));
            }
            var providerObj = this,
              wasStarted = !1,
              activeTimer = !1,
              settings = { url: '/devinfo', interval: 3e3, timeout: 2e3 },
              mode = 'pending',
              availableCount = 0,
              notAvailableCount = 0;
            return {
              init: init,
              once: request,
              start: start,
              stop: stop,
              complete: complete,
              setMode: setMode,
            };
          },
        ]),
        this
      );
    };
  deviceAvailableModule.provider('deviceAvailable', [deviceAvailable]);
  var deviceAvailableInfo = function() {
    function isChangeStatus() {
      return status != statusOld;
    }
    function isNegativeStatusSet() {
      return isChangeStatus() && status !== !0;
    }
    function isPositiveStatusAgain() {
      return isChangeStatus() && !_.isUndefined(statusOld) && status === !0;
    }
    function updateState() {
      state = isNegativeStatusSet()
        ? 'device_become_unavailable'
        : isPositiveStatusAgain()
          ? 'device_available_again'
          : 'device_not_change_available';
    }
    function isResponseError(data, error) {
      return error || !data;
    }
    function updateStatus(data, error) {
      (statusOld = _.clone(status)), (status = !isResponseError(data, error));
    }
    var status,
      statusOld,
      state,
      update = function(data, error) {
        updateStatus(data, error), updateState();
      },
      clean = function() {
        (status = void 0), (statusOld = void 0), (state = void 0);
      },
      getState = function() {
        return state;
      },
      getStatus = function() {
        return status;
      };
    return {
      clean: clean,
      update: update,
      getState: getState,
      getStatus: getStatus,
    };
  };
  deviceAvailableModule.factory('deviceAvailableInfo', [deviceAvailableInfo]);
  var deviceMacInfo = function() {
    function parseMacAddress(data) {
      return data && data.lan && data.lan[0] ? data.lan[0].mac : void 0;
    }
    var mac = void 0,
      init = function(data) {
        var newMac = parseMacAddress(data);
        return _.isUndefined(newMac) ? !1 : (update(newMac), !0);
      },
      update = function(newMac) {
        mac = newMac;
      },
      compare = function(data) {
        var compareMac = parseMacAddress(data);
        return _.isUndefined(compareMac) || compareMac == mac;
      };
    return { init: init, update: update, compare: compare };
  };
  deviceAvailableModule.factory('deviceMacInfo', [deviceMacInfo]);
})();
