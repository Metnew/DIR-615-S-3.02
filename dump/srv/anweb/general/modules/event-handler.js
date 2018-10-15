'use strict';
!(function() {
  function eventHandlerConfig($injector, $provide, $httpProvider) {
    var deviceAvailable = $injector.get('deviceAvailableProvider');
    (deviceAvailable.getNotAvailableCallback = [
      '$rootScope',
      'deviceAvailableMode',
      function($rootScope, mode) {
        'pending' == mode &&
          $rootScope.$emit('device.state.not_available', {
            mode: 'basic',
            count: 1,
          });
      },
    ]),
      (deviceAvailable.getAvailableAgainCallback = [
        '$rootScope',
        'deviceAvailableMode',
        function($rootScope, mode) {
          switch (mode) {
            case 'pending':
            case 'request':
            case 'reboot.pending':
            case 'save.and.reboot.pending':
            case 'reset.pending':
              $rootScope.$emit('device.state.available_again');
          }
        },
      ]),
      (deviceAvailable.getAvailableCountCallback = [
        '$rootScope',
        'deviceAvailableMode',
        'deviceAvailableCount',
        function($rootScope, mode, count) {
          switch (mode) {
            case 'reboot':
            case 'save.and.reboot':
            case 'reset':
            case 'fwupdate.local':
            case 'fwupdate.remote':
              3 == count &&
                $rootScope.$emit('device.action.succeed', { action: mode });
          }
        },
      ]),
      (deviceAvailable.getNotAvailableCountCallback = [
        '$rootScope',
        'deviceAvailableMode',
        'deviceNotAvailableCount',
        function($rootScope, mode, count) {
          switch (mode) {
            case 'pending':
              $rootScope.$emit('device.state.not_available', {
                mode: 'basic',
                count: count,
              });
              break;
            case 'request':
            case 'reboot.pending':
            case 'save.and.reboot.pending':
            case 'reset.pending':
              $rootScope.$emit('device.state.not_available', { mode: 'icon' });
              break;
            case 'reboot':
            case 'save.and.reboot':
            case 'reset':
              5 == count &&
                $rootScope.$emit('device.action.failed', { action: mode });
          }
        },
      ]),
      $provide.decorator('$http', function($delegate, $rootScope) {
        function $generateHttpEvent(method) {
          function __formRequestData(config, data, method) {
            var rq = { config: {} };
            return (
              _.isString(config)
                ? ((rq.config.url = config),
                  (rq.config.method = method ? method.toUpperCase() : ''))
                : (rq.config = _.extend(rq.config, config)),
              data && (rq.data = data),
              rq
            );
          }
          function __rqStarted(request) {
            $rootScope.$emit('request.started', request);
          }
          function __rqFinally(request) {
            $rootScope.$emit('request.finally', request);
          }
          function __rqSucceed(response) {
            $rootScope.$emit('request.succeed', response);
          }
          function __rqFailed(response) {
            $rootScope.$emit('request.failed', response);
          }
          return function(config, data) {
            var http = method ? $http[method] : $http,
              requestData = __formRequestData(config, data, method);
            __rqStarted(requestData);
            var request = http.apply($http, arguments);
            return (
              request.then(__rqSucceed, __rqFailed),
              request['finally'](function() {
                __rqFinally(requestData);
              }),
              request
            );
          };
        }
        var $http = $delegate,
          wrapper = $generateHttpEvent();
        return (
          Object.keys($http)
            .filter(function(key) {
              return 'function' == typeof $http[key];
            })
            .forEach(function(method) {
              wrapper[method] = $generateHttpEvent(method);
            }),
          wrapper
        );
      });
  }
  function eventHandlerProvider() {
    function $get(
      $injector,
      $rootScope,
      $timeout,
      $window,
      devinfo,
      deviceAvailable,
      funcs,
      overlay
    ) {
      function activate() {
        _.each(handler, function(elem) {
          elem.activate();
        });
      }
      function suspend() {
        _.each(handler, function(elem) {
          elem.suspend();
        });
      }
      function resume() {
        _.each(handler, function(elem) {
          elem.resume();
        });
      }
      function setFlag(name, value) {
        _.has(flags, name) && (flags[name] = value);
      }
      function filter() {
        providerObj.notUseHandlers &&
          _.each(providerObj.notUseHandlers, function(key) {
            delete handler[key];
          });
      }
      function __callCallback(name, params) {
        (params = params || {}),
          providerObj[name] &&
            $injector.invoke(providerObj[name], null, {
              callbackParams: params,
              $rootScope: $rootScope,
            });
      }
      var handler = {},
        flags = { requestOverlaySuspend: !1 };
      return (
        (handler.request = (function() {
          function activate() {
            events.push($rootScope.$on('request.started', requestStarted)),
              events.push($rootScope.$on('request.succeed', requestComplited)),
              events.push($rootScope.$on('request.failed', requestComplited)),
              events.push($rootScope.$on('request.finally', requestFinally)),
              events.push(
                $rootScope.$on('request.not_authorized', requestNotAuthorized)
              );
          }
          function suspend() {
            for (; events.length > 0; ) {
              var event = events.splice(0, 1);
              event[0]();
            }
          }
          function requestStarted($event, request) {
            isExcludeRequest(request.config) ||
              (devinfo.suspendAll(),
              deviceAvailable.setMode('request'),
              flags.requestOverlaySuspend ||
                __callCallback('overlaySimpleStart', {
                  event: request.config.url,
                  request: request,
                }));
          }
          function requestComplited($event, response) {
            isExcludeRequest(response.config) ||
              (devinfo.resumeAll(),
              deviceAvailable.setMode('pending'),
              __callCallback('overlaySimpleStop', {
                event: response.config.url,
              }));
          }
          function requestFinally($event, request) {
            isExcludeRequest(request.config) || actionDefinition(request);
          }
          function requestNotAuthorized($event, response) {
            isExcludeRequest(response.config) ||
              (deviceAvailable.setMode('pending'),
              __callCallback('overlaySimpleStop', {
                event: response.config.url,
              }));
          }
          function isExcludeRequest(config) {
            return _.some(excludeRequest, function(re) {
              return re.test(config.url);
            });
          }
          function actionDefinition(request) {
            function isRebootSystem(request) {
              return funcs.is.somovdRequest(request, 'cmd', { id: 6 });
            }
            function isSaveAndRebootSystem(request) {
              return funcs.is.somovdRequest(request, 'cmd', { id: 8 });
            }
            function isResetSystem(request) {
              return funcs.is.somovdRequest(request, 'cmd', { id: 10 });
            }
            isRebootSystem(request) &&
              handler.deviceAction.pub.started(null, { action: 'reboot' }),
              isSaveAndRebootSystem(request) &&
                handler.deviceAction.pub.started(null, {
                  action: 'save.and.reboot',
                }),
              isResetSystem(request) &&
                handler.deviceAction.pub.started(null, { action: 'reset' });
          }
          var events = [],
            excludeRequest = [/devinfo*/, /fwupdate*/, /\.html$/, /\.js$/],
            pub = {};
          return {
            activate: activate,
            suspend: suspend,
            resume: activate,
            pub: pub,
          };
        })()),
        (handler.deviceAction = (function() {
          function activate() {
            events.push($rootScope.$on('device.action.started', actionStarted)),
              events.push(
                $rootScope.$on('device.action.suspend', actionSuspend)
              ),
              events.push($rootScope.$on('device.action.resume', actionResume)),
              events.push(
                $rootScope.$on('device.action.succeed', actionSucceed)
              ),
              events.push($rootScope.$on('device.action.failed', actionFailed)),
              (pub.started = actionStarted);
          }
          function suspend() {
            for (; events.length > 0; ) {
              var event = events.splice(0, 1);
              event[0]();
            }
            _.each(pub, function(func, key) {
              pub[key] = function() {};
            });
          }
          function actionStarted($event, params) {
            switch (params.action) {
              case 'reboot':
              case 'save.and.reboot':
                var duration = providerObj.deviceRebootTime,
                  checkStarted = duration - 0.5 * duration,
                  precheckSuspend = !1;
                break;
              case 'reset':
                var duration = providerObj.deviceResetConfigTime,
                  checkStarted = duration - 0.5 * duration,
                  precheckSuspend = !1;
                break;
              case 'fwupdate.local':
                var duration =
                    providerObj.deviceLocalFwUploadTime +
                    providerObj.deviceLocalFwUpdateTime +
                    providerObj.deviceRebootTime,
                  checkStarted = 3e4 + providerObj.deviceLocalFwUploadTime,
                  precheckSuspend = !1;
                break;
              case 'fwupdate.remote':
                var duration =
                    providerObj.deviceLocalFwUploadTime +
                    providerObj.deviceLocalFwUpdateTime +
                    providerObj.deviceRebootTime,
                  checkStarted = 3e4,
                  precheckSuspend = !0;
                break;
              case 'dcc.apply':
                var duration = 9e4,
                  checkStarted = 15e3,
                  precheckSuspend = !1;
            }
            deviceAvailable.setMode(params.action + '.pending'),
              devinfo.suspendAll(),
              precheckSuspend && deviceAvailable.stop(),
              __callCallback('getDeviceActionStartedCallback', {
                action: params.action,
                duration: duration,
              }),
              (checkTimer = $timeout(function() {
                precheckSuspend && deviceAvailable.start(),
                  deviceAvailable.setMode(params.action);
              }, checkStarted)),
              (endTimer = $timeout(function() {
                switch (params.action) {
                  case 'fwupdate.local':
                    return actionFailed(null, params);
                  default:
                    return actionSucceed(null, params);
                }
              }, duration));
          }
          function actionSuspend($event, params) {
            deviceAvailable.setMode(params.action + '.pending');
          }
          function actionResume($event, params) {
            deviceAvailable.setMode(params.action);
          }
          function actionSucceed($event, params) {
            actionTimeoutBreak(),
              actionDevinfoResume(),
              deviceAvailable.setMode('pending'),
              __callCallback('getDeviceActionSucceedCallback', params);
          }
          function actionFailed($evenet, params) {
            actionTimeoutBreak(),
              actionDevinfoResume(),
              __callCallback('getDeviceActionFailedCallback', params);
          }
          function actionTimeoutBreak() {
            $timeout.cancel(checkTimer), $timeout.cancel(endTimer);
          }
          function actionDevinfoResume() {
            devinfo.init({ timeout: 5e3 }), devinfo.resumeAll();
          }
          var checkTimer,
            endTimer,
            events = [],
            pub = {};
          return {
            activate: activate,
            suspend: suspend,
            resume: activate,
            pub: pub,
          };
        })()),
        (handler.deviceAvailable = (function() {
          function activate() {
            events.push(
              $rootScope.$on('device.state.not_available', notAvailable)
            ),
              events.push(
                $rootScope.$on('device.state.available_again', availableAgain)
              );
          }
          function suspend() {
            for (; events.length > 0; ) {
              var event = events.splice(0, 1);
              event[0]();
            }
          }
          function notAvailable($event, params) {
            __callCallback('overlayNotAvailableStart', params);
          }
          function availableAgain() {
            __callCallback('overlayNotAvailableStop');
          }
          var events = [],
            pub = {};
          return {
            activate: activate,
            suspend: suspend,
            resume: activate,
            pub: pub,
          };
        })()),
        (handler.uiRouter = (function() {
          function activate() {
            events.push($rootScope.$on('$stateChangeStart', stateChangeStart)),
              events.push(
                $rootScope.$on('$stateChangeError', stateChangeError)
              ),
              events.push($rootScope.$on('stateChangeBreak', stateChangeBreak)),
              events.push($rootScope.$on('pageload', pageload));
          }
          function suspend() {
            for (; events.length > 0; ) {
              var event = events.splice(0, 1);
              event[0]();
            }
          }
          function stateChangeStart($event, toState) {
            (toState.controller || (toState.views && toState.views[''])) &&
              __callCallback('overlaySimpleStart', { event: 'pageload' });
          }
          function stateChangeError() {
            __callCallback('overlaySimpleStop', { event: 'pageload' });
          }
          function stateChangeBreak() {
            __callCallback('overlaySimpleStop', { event: 'pageload' });
          }
          function pageload() {
            __callCallback('overlaySimpleStop', { event: 'pageload' });
          }
          var events = [],
            pub = {};
          return {
            activate: activate,
            suspend: suspend,
            resume: activate,
            pub: pub,
          };
        })()),
        (handler.navigation = (function() {
          function activate() {
            $window.onunload = onuload;
          }
          function suspend() {
            $window.onunload = null;
          }
          function onuload() {
            devinfo.suspendAll(), deviceAvailable.complete();
          }
          var pub = {};
          return {
            activate: activate,
            suspend: suspend,
            resume: activate,
            pub: pub,
          };
        })()),
        filter(),
        activate(),
        { suspend: suspend, resume: resume, setFlag: setFlag }
      );
    }
    var providerObj = this;
    return (
      (this.notUseHandlers = null),
      (this.deviceRebootTime = null),
      (this.deviceResetConfigTime = null),
      (this.deviceLocalFwUploadTime = null),
      (this.deviceLocalFwUpdateTime = null),
      (this.overlaySimpleStart = null),
      (this.overlaySimpleStop = null),
      (this.overlayNotAvailableStart = null),
      (this.overlayNotAvailableStop = null),
      (this.getDeviceActionStartedCallback = null),
      (this.getDeviceActionSucceedCallback = null),
      (this.getDeviceActionFailedCallback = null),
      (this.$get = [
        '$injector',
        '$rootScope',
        '$timeout',
        '$window',
        'devinfo',
        'deviceAvailable',
        'funcs',
        'overlay-core',
        $get,
      ]),
      this
    );
  }
  var eventHandlerModule = angular.module(regdep('eventHandler'), [
    'devinfo',
    'deviceAvailable',
    'app-module-funcs',
  ]);
  eventHandlerModule.config([
    '$injector',
    '$provide',
    '$httpProvider',
    eventHandlerConfig,
  ]),
    eventHandlerModule.provider('eventHandler', [eventHandlerProvider]);
})();
