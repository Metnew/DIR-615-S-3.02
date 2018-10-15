'use strict';
!(function() {
  (window.goAway = function(href) {
    (window.onbeforeunload = null), (location.href = href);
  }),
    (appDeps = appDeps.concat([
      'ngTouch',
      'app.config',
      'ui.router',
      'nw',
      'ngDialog',
      'dcc.device',
      'dcc',
      'app-module-funcs',
      'svgIcon',
    ]));
  var app = angular.module('wizard', appDeps);
  app.constant(
    'queryString',
    (function(a) {
      if ('' == a) return {};
      for (var b = {}, i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        2 == p.length &&
          (b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' ')));
      }
      return b;
    })(window.location.search.substr(1).split('&'))
  ),
    app.run([
      '$q',
      'somovd',
      function($q, somovd) {
        function isResetAndReboot(req) {
          return 10 == req.params.id && 'cmd' == req.method;
        }

        function saveMbssid(defer, res) {
          try {
            mbssidToSessionStorage(res.data, 'mbssid'),
              mbssidToSessionStorage(res.data, '5G_mbssid');
          } catch (e) {
          } finally {
            defer.resolve();
          }
        }

        function mbssidToSessionStorage(data, key) {
          sessionStorage.setItem(key, JSON.stringify(data[key]));
        }
        somovd.prepareHook(function(reqs) {
          var defer = $q.defer();
          return (
            reqs.some(isResetAndReboot)
              ? somovd.read(35, saveMbssid.bind(null, defer))
              : defer.resolve(),
            defer.promise
          );
        });
      },
    ]),
    (window.GET_PARAMS = (function(a) {
      if ('' == a) return {};
      for (var b = {}, i = 0; i < a.length; ++i) {
        var p = a[i].split('=');
        2 == p.length &&
          (b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' ')));
      }
      return b;
    })(window.location.search.substr(1).split('&'))),
    (window.URL_HASH = window.GET_PARAMS ? window.GET_PARAMS.redirecturl : ''),
    app.constant('endpointConfig', {
      somovd: '/jsonrpc',
      devinfo: '/devinfo',
      dcc_remote_update: '/dcc_remote_update',
      dcc_update_gwif_connection: '/dcc_update_gwif_connection',
      dcc_get_rofiles: '/dcc_get_profiles',
      dcc_apply: '/dcc_apply',
    }),
    app.config([
      '$stateProvider',
      '$injector',
      'pageList',
      '$urlRouterProvider',
      'navigation',
      'endpointConfig',
      '$controllerProvider',
      '$filterProvider',
      '$compileProvider',
      function(
        $stateProvider,
        $injector,
        pageList,
        $urlRouterProvider,
        navigation,
        endpointConfig,
        $controllerProvider,
        $filterProvider,
        $compileProvider
      ) {
        (app.controllerProvider = $controllerProvider),
          (app.filterProvider = $filterProvider),
          (app.compileProvider = $compileProvider),
          _.each(navigation, function(elem, inx) {
            var state = null;
            if (elem.page)
              if (_.isObject(elem.page)) {
                var views = {};
                _.each(elem.page, function(_elem, _inx) {
                  var _page = pageList[_elem];
                  if (_page) {
                    console.log(_page.html);
                    var view = {
                      templateUrl: _.isArray(_page.html)
                        ? _.first(_page.html)
                        : _page.html,
                      controller: _page.ctrl,
                      controllerAs: _page.ctrlAlias,
                    };
                    views[_inx] = view;
                  }
                }),
                  (state = {
                    views: views,
                    url: elem.url,
                    params: elem.url ? void 0 : elem.params,
                  });
              } else {
                var page = pageList[elem.page];
                state = page
                  ? {
                      templateUrl: _.isArray(page.html)
                        ? _.first(page.html)
                        : page.html,
                      controller: page.ctrl,
                      controllerAs: page.ctrlAlias,
                      url: elem.url,
                      params: elem.params,
                    }
                  : {
                      template:
                        '<div class="content_padding"><h3>Page not found</h3></div>',
                      url: elem.url,
                      params: elem.url ? void 0 : elem.params,
                    };
              }
            else
              state = {
                abstract: !0,
                url: elem.url,
                template: '<ui-view/>',
              };
            state && $stateProvider.state(inx, state);
          });
        var deviceAvailable = $injector.get('deviceAvailableProvider'),
          MAX_ERROR_REQ_COUNT = 5;
        (deviceAvailable.getNotAvailableCountCallback = [
          '$rootScope',
          function($rootScope) {
            $rootScope.rootReqErrorCount++,
              $rootScope.rootReqErrorCount >= MAX_ERROR_REQ_COUNT &&
                (($rootScope.gDeviceAvail = !1),
                $rootScope.$broadcast('DeviceNotAvail'));
          },
        ]),
          (deviceAvailable.getNotAvailableCallback = [
            '$rootScope',
            function($rootScope) {},
          ]),
          (deviceAvailable.getAvailableAgainCallback = [
            '$rootScope',
            'somovd',
            function($rootScope, somovd) {
              console.log('device avail'),
                ($rootScope.gDeviceAvail = !0),
                ($rootScope.rootReqErrorCount = 0),
                $rootScope.$broadcast('DeviceAvail'),
                $rootScope.gNeedAuth &&
                  (console.log('ping device'), somovd.read(145));
            },
          ]),
          (deviceAvailable.getMACAddressChangeCallback = [
            '$q',
            function($q) {
              return console.log('device mac changed'), $q.reject();
            },
          ]);
        var authWizardProvider = $injector.get('authDigestProvider');
        (authWizardProvider.authHeaderName = 'anweb-authenticate'),
          (authWizardProvider.autologinHeaderName =
            'anweb-auth-autologin-available'),
          (authWizardProvider.repeatRequestHeaderName = 'anweb-repeat-request'),
          (authWizardProvider.authHeaderName = 'anweb-authenticate'),
          (authWizardProvider.authDefaultUsername = 'admin'),
          (authWizardProvider.authDefaultPassword = 'admin'),
          (authWizardProvider.deviceSessionHeaderName = 'device-session-id'),
          (authWizardProvider.getCredentialsCallback = [
            '$q',
            'authParams',
            '$rootScope',
            function($q, authParams, $rootScope) {
              var defered = $q.defer();
              return (
                !$rootScope.gAutoAuth ||
                ((('dcc_finished' == $rootScope.gDeviceInfo.dccStatus &&
                  !$rootScope.nativeData) ||
                  $rootScope.gDeviceInfo.dccAborted) &&
                  'NeedChangePass' != $rootScope.gDeviceInfo.systemNotice)
                  ? $rootScope.$broadcast('NeedAuth', {
                      defered: defered,
                      params: authParams,
                    })
                  : (($rootScope.gAutoAuth = !1),
                    ($rootScope.gAutoAuthSkipErr = !0),
                    defered.resolve({
                      username: $rootScope.gAuth.username,
                      password: $rootScope.gAuth.password,
                    })),
                defered.promise
              );
            },
          ]),
          $urlRouterProvider.otherwise('/loading');
        var somovd = $injector.get('somovdProvider');
        somovd.somovdEndPoint = endpointConfig.somovd;
      },
    ]),
    app.controller('wizardCtrl', [
      '$q',
      '$http',
      '$rootScope',
      '$scope',
      'translate',
      '$state',
      'devinfo',
      '$window',
      'stepManager',
      '$timeout',
      'profiles',
      'somovd',
      'deviceAvailable',
      'cookie',
      'regions',
      'device',
      'detectLang',
      'endpointConfig',
      'fieldConfig',
      'supportInfoLoader',
      'queryString',
      function(
        $q,
        $http,
        $rootScope,
        $scope,
        translate,
        $state,
        devinfo,
        $window,
        stepManager,
        $timeout,
        profiles,
        somovd,
        deviceAvailable,
        cookie,
        regions,
        device,
        detectLang,
        endpointConfig,
        fieldConfig,
        supportInfoLoader,
        queryString
      ) {
        function getWANStatus(ports) {
          var etherwan = _.find(ports, function(port) {
            return port.isEtherwan;
          });
          if (etherwan) return etherwan.status > 0;
          var wan = _.find(ports, function(port) {
            return port.isWan;
          });
          return wan && wan.status > 0;
        }

        function initData(needAuth, factory, cb) {
          function onData(data) {
            data && data.deviceClass
              ? (($rootScope.gDeviceInfo = data),
                _.size($rootScope.gDeviceInfo.supportMail) &&
                  ($rootScope.gDeviceInfo.supportMail = $rootScope.gDeviceInfo.supportMail.replace(
                    />|</g,
                    ''
                  )),
                ($rootScope.gIsDSL =
                  data.deviceClass && 'DSL' == data.deviceClass),
                ($rootScope.gWANStatus = data.dsl
                  ? !!parseInt(data.dsl.adslTrainingState)
                  : getWANStatus(data.availPorts)),
                ($rootScope.rootStartState = GET_PARAMS.dbgStartState
                  ? GET_PARAMS.dbgStartState
                  : data.deviceStartState),
                ($rootScope.rootBoxInfo =
                  data.boxInfo && _.size(data.boxInfo.ports)
                    ? data.boxInfo
                    : {
                        ports: ['port1', 'port2', 'port3', 'port4', 'internet'],
                      }),
                ($rootScope.rootAvailPorts = data.availPorts),
                ($rootScope.rootLANPorts = _.filter(data.availPorts, function(
                  port
                ) {
                  return /^(port|LAN)\d$/.test(port.name) && !port.isWan;
                })),
                ($rootScope.rootWANPort = _.find(data.availPorts, function(
                  port
                ) {
                  return /^(internet|port5)$/.test(port.name) && port.isWan;
                })),
                ($rootScope.rootWIFIPorts = _.filter(data.availPorts, function(
                  port
                ) {
                  return (
                    /^wifi((\d)|(_2G-\d)|(_5G-\d))$/.test(port.name) &&
                    !port.isWan
                  );
                })),
                data.client &&
                  ($rootScope.rootIsWIFIClient = 'WLAN' == data.client.name),
                ($rootScope.rootIsSupport5G =
                  data.wifi && !!data.wifi['5G_ssid']),
                ($rootScope.rootDeviceIP = data.lan[0].ip),
                ($rootScope.rootNoRebootLAN = data.lanNeedReboot === !1),
                ($rootScope.devMode = data[112] || {}),
                refreshData(),
                ($rootScope.isInited = !0),
                cb(data))
              : $timeout(function() {
                  console.log('>>>>> RELOAD initData'),
                    devinfo
                      .once(areas)
                      .then(onData)
                      ['catch'](onData);
                }, 1500);
          }
          var areas = [
            'version',
            'wifi',
            'net',
            'notice',
            'ports',
            'box',
            'client',
            '112',
          ].join('|');
          needAuth
            ? factory
              ? somovd.read(145).then(function() {
                  devinfo
                    .once(areas)
                    .then(onData)
                    ['catch'](onData);
                })
              : (($rootScope.gAutoAuthSkipErr = !0),
                $rootScope.reauth().then(function() {
                  devinfo
                    .once(areas)
                    .then(onData)
                    ['catch'](onData);
                }))
            : devinfo
                .once(areas)
                .then(onData)
                ['catch'](onData);
        }

        function refreshData() {
          devinfo.subscribe('ports', function(data) {
            data &&
              data.availPorts &&
              ($rootScope.rootAvailPorts = data.availPorts);
          });
        }

        function initWizard() {
          function onData(info) {
            if (info && info.lang) {
              if (1 == _.size($rootScope.rootLangs))
                translate.changeLanguage($rootScope.rootLangs[0]);
              else if (info.factorySettings) {
                var lang = detectLang();
                console.log('use browser lang:', lang),
                  translate.changeLanguage(detectLang());
              } else
                console.log('use devinfo lang:', info.lang),
                  translate.changeLanguage(info.lang);
              info.factorySettings && ($rootScope.gNeedAuth = !0),
                initData($rootScope.gNeedAuth, info.factorySettings, function(
                  data
                ) {
                  stepManager.init(data, function() {
                    $timeout(function() {
                      $rootScope.showOverlay(!1),
                        $rootScope.showView(!0),
                        $rootScope.$broadcast('FirstDevinfoPulled', data);
                    }, 1e3);
                  });
                });
            } else
              $timeout(function() {
                console.log('>>>>> RELOAD initWizard'),
                  devinfo
                    .once(areas)
                    .then(onData)
                    ['catch'](onData);
              }, 1500);
          }
          var areas = 'notice|ports|version';
          devinfo
            .once(areas)
            .then(onData)
            ['catch'](onData);
        }

        function updateInfo(data) {
          data &&
            (($rootScope.gDongleData = data.dongle),
            ($rootScope.rootUseProto = data.ipv4gw ? 'v4' : 'v6'),
            ($rootScope.gWANStatus = window.dbgWANStatus
              ? !0
              : data.dsl
                ? !!parseInt(data.dsl.adslTrainingState)
                : getWANStatus(data.availPorts)),
            ($rootScope.gAvailPorts = data.availPorts),
            ($rootScope.rootStartState = window.dbgStartState
              ? window.dbgStartState
              : data.deviceStartState));
        }
        ($rootScope.rootLangs = 'eng rus'.split(' ')),
          ($rootScope.rootUpdateChecked = !1),
          ($rootScope.rootUpdateVersion = ''),
          ($rootScope.rootReqErrorCount = 0),
          ($rootScope.rootAdminURL = '/admin'),
          ($rootScope.gWANStatus = !1),
          ($rootScope.gDongleData = null),
          ($rootScope.gDeviceAvail = !0),
          ($rootScope.gAvailOverlay = !0),
          ($rootScope.gAvailPorts = []),
          ($rootScope.gDeviceInfo = {}),
          ($rootScope.gIsDSL = !1),
          ($rootScope.gReversPortNames = !1),
          ($rootScope.gIsShowOverlay = !1),
          ($rootScope.gShowAuthDialog = !1),
          ($rootScope.gAwayURL = stepManager.getAwayURL()),
          ($rootScope.gAutoAuth = !0),
          ($rootScope.gAutoAuthSkipErr = !1),
          ($rootScope.gShowView = !0),
          ($rootScope.gFirstCableStep = 'checkcable'),
          ($rootScope.gLanPorts = []),
          ($rootScope.gPorts = []),
          ($rootScope.gAuth = {
            username: 'admin',
            password: 'admin',
          }),
          ($rootScope.device = device),
          ($rootScope.gAuth = {
            username: 'admin',
            password: 'admin',
          }),
          devinfo.init({
            need_auth: !1,
          }),
          supportInfoLoader.update(),
          ($rootScope.gSkipGEO = !0),
          (window.onbeforeunload = function() {
            return translate('wizard_unsaved_warn');
          }),
          deviceAvailable.start(),
          translate.changeLanguage(
            1 == _.size($rootScope.rootLangs) ? $rootScope.rootLangs[0] : 'eng'
          );
        var stepMap = {
          lang: {
            next: 'geo',
            prev: 'info',
          },
          geo: {
            next: 'search',
            prev: 'lang',
          },
          search: {
            prev: 'geo',
          },
          search_fail: {
            prev: 'search',
          },
          provlist: {
            next: 'master',
            prev: 'search',
          },
          servicelist: {
            next: 'master',
            prev: 'provlist',
          },
          master: {
            prev: 'search',
            next: 'summary',
          },
          status: {
            prev: 'summary',
          },
        };
        $scope.$on('NeedAuth', function() {
          $rootScope.rootAuthDialogIsOpen = !0;
        }),
          $scope.$on('Authed', function() {
            $rootScope.rootAuthDialogIsOpen = !1;
          }),
          ($rootScope.getRedirectUrl = $scope.getRedirectUrl = function() {
            return URL_HASH ? URL_HASH : $scope.gAwayURL;
          }),
          ($rootScope.isAutoupdateEnabled = function(nativeProfile) {
            return !$scope.rootUpdateChecked;
          }),
          ($rootScope.exitFromWizard = function(firstData, skipWait) {
            function applyLang(cb) {
              var somovd = device.profile.nativeToSomovd({
                Config: {
                  SystemLanguage: {
                    Language: translate.getLang(),
                  },
                },
              });
              profiles.apply(
                somovd,
                function(data) {
                  cb && cb(data);
                },
                !0
              );
            }
            var waitFactoryChange = skipWait ? 0 : 2e3;
            $rootScope.showOverlay(!0),
              $rootScope.showAvailOverlay(!1),
              firstData
                ? applyLang(function() {
                    deviceAvailable.stop(),
                      $timeout(function() {
                        goAway($rootScope.rootAdminURL);
                      }, waitFactoryChange);
                  })
                : (deviceAvailable.stop(),
                  $timeout(function() {
                    goAway($rootScope.rootAdminURL);
                  }, waitFactoryChange));
          }),
          ($rootScope.setAutoAuth = function(username, password) {
            ($rootScope.gAutoAuth = !0),
              ($rootScope.gAuth = {
                username: username,
                password: password,
              });
          }),
          ($rootScope.setNeedAuth = function(val) {
            $rootScope.gNeedAuth = val;
          }),
          ($rootScope.reauth = function() {
            return (
              ($rootScope.gAutoAuth = !1),
              $rootScope.$on('logout'),
              somovd.read(145)
            );
          }),
          ($rootScope.nextStep = function(params) {
            var name = $state.$current.name;
            stepMap[name] &&
              stepMap[name].next &&
              $state.go(stepMap[name].next, params);
          }),
          ($rootScope.prevStep = function(params) {
            var name = $state.$current.name;
            stepMap[name] &&
              stepMap[name].prev &&
              $state.go(stepMap[name].prev, params);
          }),
          ($rootScope.scrollToTop = function() {
            _.defer(function() {
              (document.body.scrollTop = 0),
                (document.documentElement.scrollTop = 0);
            });
          }),
          ($rootScope.showOverlay = function(val) {
            $rootScope.gIsShowOverlay = val;
          }),
          ($rootScope.showAvailOverlay = function(val) {
            $rootScope.gAvailOverlay = val;
          }),
          ($rootScope.showView = function(val) {
            $rootScope.gShowView = val;
          }),
          ($rootScope.overlayIsShowed = function() {
            return $rootScope.gIsShowOverlay;
          }),
          ($rootScope.searchStateLogic = function(data) {
            ($rootScope.providers = _.groupBy(data, 'Provider')),
              _.size($rootScope.providers) > 1
                ? $state.go('provlist')
                : 1 == _.size($rootScope.providers)
                  ? (($rootScope.servicelist = _.find(
                      $rootScope.providers,
                      function() {
                        return !0;
                      }
                    )),
                    _.size($rootScope.servicelist) > 1
                      ? $state.go('servicelist')
                      : 1 == _.size($rootScope.servicelist)
                        ? (($rootScope.selectedProfile = _.first(
                            $rootScope.servicelist
                          )),
                          $state.go('master'))
                        : $state.go('search_fail'))
                  : $state.go('search_fail');
          }),
          $scope.$on('$stateChangeSuccess', function(
            event,
            state,
            params,
            fromState,
            fromParams
          ) {
            $rootScope.showAvailOverlay(!0),
              ($rootScope.previousState = fromState.name),
              ($rootScope.currentState = state.name);
          }),
          $rootScope.showOverlay(!0),
          $rootScope.showView(!1),
          ($scope.translateWifiSecurityMode = function(mode) {
            return 'None' == mode ? 'Open' : mode;
          }),
          ($scope.translatePinStatus = function(status) {
            return 'puk_required' == status
              ? 'PUK'
              : 'puk2_required' == status
                ? 'PUK2'
                : 'PIN';
          }),
          ($scope.showVLANSection = function() {
            return (
              $scope.nativeData &&
              $scope.nativeData.Config.VLAN &&
              _.size($scope.nativeData.Config.VLAN.services) > 0
            );
          }),
          ($scope.showPortPanel = function() {
            return $scope.nativeData && $scope.nativeData.Config.VLAN
              ? _.find($scope.nativeData.Config.VLAN.groups.lan, function(
                  port
                ) {
                  return port.service;
                })
              : !1;
          });
        var updateAreas = ['ports', 'notice', 'dongle', 'net'].join('|');
        devinfo.once(updateAreas).then(updateInfo),
          devinfo.subscribe(updateAreas, updateInfo),
          $rootScope.$watch('gDongleData.status', function(status) {
            ($rootScope.rootDongleReadyStamp =
              'ready' == status ? _.now() : null),
              console.log(
                'rootDongleReadyStamp is',
                $rootScope.rootDongleReadyStamp
              );
          }),
          initWizard(),
          (window.P = function(native) {
            ($rootScope.selectedProfile = native), $state.go('master');
          }),
          (window.$rootScope = $rootScope);
      },
    ]);
})();
