'use strict';
!(function() {
  svg4everybody(),
    (appDeps = appDeps.concat([
      'ngTouch',
      'app.config',
      'ui.router',
      'unsavedChanges',
      'device',
      'app-module-funcs',
      'nw',
      'svgIcon',
      'auth-digest',
      'ngDialog',
      'angular-progress-arc',
      'duScroll',
    ]));
  var app = angular.module('app', appDeps);
  app.run(function() {
    FastClick.attach(document.body);
  }),
    app.constant('fieldConfig', {
      style: 'material',
    }),
    app.config([
      '$stateProvider',
      '$urlRouterProvider',
      'navigation',
      'unsavedWarningsConfigProvider',
      'notificationsProvider',
      'pageList',
      '$controllerProvider',
      '$filterProvider',
      '$compileProvider',
      'ngDialogProvider',
      '$injector',
      function(
        $stateProvider,
        $urlRouterProvider,
        navigation,
        unsavedWarningsConfigProvider,
        notificationsProvider,
        pageList,
        $controllerProvider,
        $filterProvider,
        $compileProvider,
        ngDialogProvider,
        $injector
      ) {
        (app.controllerProvider = $controllerProvider),
          (app.filterProvider = $filterProvider),
          (app.compileProvider = $compileProvider),
          notificationsProvider.setContainer(
            document.querySelectorAll('.popup-notification-container')
          ),
          (unsavedWarningsConfigProvider.useTranslateService = !1),
          (unsavedWarningsConfigProvider.navigateMessage = 'navigateMessage'),
          (unsavedWarningsConfigProvider.reloadMessage = 'reloadMessage');
        var authDigestProvider = $injector.get('authDigestProvider');
        (authDigestProvider.authHeaderName = 'anweb-authenticate'),
          (authDigestProvider.autologinHeaderName =
            'anweb-auth-autologin-available'),
          (authDigestProvider.repeatRequestHeaderName = 'anweb-repeat-request'),
          (authDigestProvider.deviceSessionHeaderName = 'device-session-id'),
          (authDigestProvider.authDefaultUsername = 'admin'),
          (authDigestProvider.authDefaultPassword = 'admin'),
          (authDigestProvider.getCredentialsCallback = [
            '$location',
            '$q',
            'ngDialog',
            'authParams',
            function($location, $q, ngDialog, authParams) {
              function getCredentialsFromDialog(ngDialog, authParams) {
                return ngDialog
                  .open({
                    template: 'dialogs/login/dialog.tpl.html',
                    className: 'login_dialog',
                    closeByDocument: !1,
                    closeByEscape: !1,
                    controller: LoginDialogCtrl,
                    showClose: !1,
                    data: {
                      clientTryCount: authParams.clientTryCount,
                      tryCountRemain: authParams.tryCountRemain,
                      banTimeRemain: authParams.banTimeRemain,
                      banReason: authParams.banReason,
                      notAuthorized: authParams.notAuthorized,
                    },
                  })
                  .closePromise.then(function(data) {
                    return data.value;
                  });
              }
              var getCredentialsFromUrl;
              return _.isFunction(getCredentialsFromUrl)
                ? getCredentialsFromUrl($location, $q).then(
                    function(credentials) {
                      return credentials;
                    },
                    function() {
                      return getCredentialsFromDialog(ngDialog, authParams);
                    }
                  )
                : getCredentialsFromDialog(ngDialog, authParams);
            },
          ]),
          $script.path('/'),
          ngDialogProvider.setDefaults({
            closeByDocument: !1,
            showClose: !1,
          });
        var somovd = $injector.get('somovdProvider');
        somovd.somovdEndPoint = '/jsonrpc';
        var eventHandler = $injector.get('eventHandlerProvider');
        (eventHandler.deviceRebootTime = parseInt('90000')),
          (eventHandler.deviceResetConfigTime = parseInt('95000')),
          (eventHandler.deviceLocalFwUploadTime = parseInt('45000')),
          (eventHandler.deviceLocalFwUpdateTime = parseInt('90000')),
          (eventHandler.overlaySimpleStart = [
            'overlay-core',
            'funcs',
            'callbackParams',
            '$rootScope',
            function(overlay, funcs, params, $rootScope) {
              function isRunOverlay(params) {
                if (params.request) {
                  if (funcs.is.silentSomovdRequest(params.request)) return !1;
                  if (
                    funcs.is.somovdRequest(params.request, 'write', {
                      id: 250,
                    })
                  )
                    return !1;
                }
                return !0;
              }
              isRunOverlay(params) &&
                ('pageload' == params.event
                  ? ($rootScope.pageReady = !1)
                  : $rootScope.pageReady && overlay.simple.start(params));
            },
          ]),
          (eventHandler.overlaySimpleStop = [
            'overlay-core',
            'callbackParams',
            '$rootScope',
            function(overlay, params, $rootScope) {
              'pageload' == params.event
                ? ($rootScope.pageReady = !0)
                : overlay.simple.stop(params);
            },
          ]),
          (eventHandler.overlayNotAvailableStart = [
            'overlay-core',
            'callbackParams',
            function(overlay, params) {
              overlay.notAvailable.start(params.mode, params.count);
            },
          ]),
          (eventHandler.overlayNotAvailableStop = [
            'overlay-core',
            'callbackParams',
            function(overlay, params) {
              overlay.notAvailable.stop(params.mode, params.count);
            },
          ]),
          (eventHandler.getDeviceActionStartedCallback = [
            'overlay-core',
            'callbackParams',
            function(overlay, params) {
              switch (params.action) {
                case 'fwupdate.local':
                case 'fwupdate.remote':
                  params.title = 'wizard_update_in_progress';
              }
              overlay.progress.start(params);
            },
          ]),
          (eventHandler.getDeviceActionSucceedCallback = [
            '$location',
            '$window',
            'deviceAvailable',
            'authDigest',
            'callbackParams',
            function($location, $window, deviceAvailable, authDigest, params) {
              function fwupdateLocal(response) {
                _.isString(response.data)
                  ? ((window.onbeforeunload = null),
                    (location.href =
                      $location.protocol() +
                      '://' +
                      $location.host() +
                      ':' +
                      $location.port()))
                  : $window.location.reload();
              }
              switch (params.action) {
                case 'fwupdate.local':
                case 'fwupdate.remote':
                  return void deviceAvailable.once().then(fwupdateLocal);
                case 'save.and.reboot':
                case 'reboot':
                case 'reset':
                  authDigest.cleanCredentials();
              }
              $window.location.reload();
            },
          ]),
          (eventHandler.getDeviceActionFailedCallback = [
            '$location',
            'deviceAvailable',
            'overlay-core',
            'authDigest',
            'funcs',
            'lanIPChange',
            'callbackParams',
            function(
              $location,
              deviceAvailable,
              overlay,
              authDigest,
              funcs,
              lanIPChange,
              params
            ) {
              function rebootHandler() {
                function isNewIP() {
                  return (
                    !isLocalhost() && !isDomain() && lanIPChange.isChange()
                  );
                }
                authDigest.cleanCredentials(),
                  isNewIP()
                    ? goToNewIP(lanIPChange.getNewIP())
                    : showErrorOverlay(),
                  lanIPChange.clear();
              }

              function resetHandler() {
                function isNeedSetDefaultIP(ip) {
                  return (
                    !isLocalhost() && !isDomain() && $location.host() != ip
                  );
                }
                authDigest.cleanCredentials();
                var defaultIP = '192.168.0.1';
                isNeedSetDefaultIP(defaultIP)
                  ? goToNewIP(defaultIP)
                  : showErrorOverlay(),
                  lanIPChange.clear();
              }

              function showErrorOverlay() {
                overlay.progress.stop(), overlay.notAvailable.start('static');
              }

              function isLocalhost() {
                var host = $location.host();
                return 'localhost' == host || '127.0.0.1' == host;
              }

              function isDomain() {
                var host = $location.host();
                return !funcs.is.ipv4(host);
              }

              function goToNewIP(ip) {
                var url = getNewURL(ip);
                (window.onbeforeunload = null), (location.href = url);
              }

              function goToRoot() {
                var url =
                  $location.protocol() +
                  '://' +
                  $location.host() +
                  ':' +
                  $location.port();
                (window.onbeforeunload = null), (location.href = url);
              }

              function getNewURL(ip) {
                var oldURL = $location.absUrl();
                return oldURL.replace(/(\:\/\/)([^:\/]*)/, function(
                  str,
                  p1,
                  p2
                ) {
                  return p1 + ip;
                });
              }
              switch (params.action) {
                case 'save.and.reboot':
                case 'reboot':
                  rebootHandler();
                  break;
                case 'reset':
                  resetHandler();
                  break;
                default:
                  deviceAvailable.once().then(goToRoot, showErrorOverlay);
              }
            },
          ]);
      },
    ]),
    app.run([
      'routerHelper',
      'pageList',
      'navigationFilter',
      'cookie',
      function(routerHelper, pageList, navigationFilter, cookie) {
        function getStates(navs, pageList) {
          var routes = [];
          return (
            _.each(navs, function(elem, inx) {
              var state = null;
              if (elem.page)
                if (_.isObject(elem.page)) {
                  var views = {};
                  _.each(elem.page, function(_elem, _inx) {
                    var _page = pageList[_elem];
                    if (_page) {
                      var view = {
                        templateUrl: _.isArray(_page.html)
                          ? _.first(_page.html)
                          : _page.html,
                        controller: _page.ctrl,
                        controllerAs: _page.ctrlAlias,
                        resolve: getLazyResolve(_page),
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
                  page &&
                    (state = {
                      templateUrl: _.isArray(page.html)
                        ? _.first(page.html)
                        : page.html,
                      controller: page.ctrl,
                      controllerAs: page.ctrlAlias,
                      url: elem.url,
                      params: elem.params,
                      resolve: getLazyResolve(page),
                    });
                }
              else
                state = {
                  abstract: !0,
                  url: elem.url,
                  template: '<ui-view/>',
                };
              state &&
                routes.push({
                  state: inx,
                  config: state,
                });
            }),
            routes
          );
        }

        function getLazyResolve(page) {
          return page.lazyDeps.length
            ? {
                deps: function($q, $rootScope, $state) {
                  var deferred = $q.defer();
                  return (
                    page.lazyDeps.length || deferred.resolve(),
                    $script(page.lazyDeps, 'deps', function() {
                      $rootScope.$apply(function() {
                        app.controllerProvider.has(page.ctrl)
                          ? ((page.lazyDeps.length = 0), deferred.resolve())
                          : (deferred.reject(),
                            $state.go('error', {
                              code: 'lazyLoadError',
                              message: 'lazyLoadErrorDesc',
                            }));
                      });
                    }),
                    deferred.promise
                  );
                },
              }
            : {
                deps: function() {},
              };
        }
        var isAPMode = 'ap' === cookie.get('device_mode'),
          navs = navigationFilter.filter(),
          states = getStates(navs, pageList);
        routerHelper.configureStates(states),
          routerHelper.setOtherwise(isAPMode ? '/summary' : '/home');
      },
    ]),
    app.run([
      '$q',
      'somovd',
      'cookie',
      'ngDialog',
      'translate',
      function($q, somovd, cookie, ngDialog, translate) {
        function prompt(key) {
          return ngDialog.openConfirm({
            template:
              '					<p style="text-align: center;">' +
              translate(key) +
              '</p>					<div class="page_container" style="text-align: center;">						<input type="button" ng-click="closeThisDialog(0)" value="Отмена">						<input type="button" ng-click="confirm(1)" value="Продолжить">					</div>',
            plain: !0,
            showClose: !1,
          });
        }
        somovd.read(187, function(res) {
          var user_ip = cookie.get('user_ip'),
            is_wifi = _.find(res.data, function(user) {
              return user.ip == user_ip && 'WiFi' == user.name;
            });
          somovd.prepareHook(function(req) {
            for (var i in req)
              if ('write' == req[i].method && 35 == req[i].params.id && is_wifi)
                return prompt('warnWiFiLost');
            var defer = $q.defer();
            return defer.resolve(), defer.promise;
          });
        });
      },
    ]),
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
    app.factory('appSharedFuncs', [
      'pageList',
      'cookie',
      'navigationFilter',
      'routerHelper',
      'somovd',
      function(pageList, cookie, navigationFilter, routerHelper, cpe) {
        var navs = navigationFilter.filter();
        return {
          makeMenuList: function() {
            return _.filter(
              _.map(arguments, function(elem) {
                var route = navs[elem];
                if (route) {
                  var menu = route.menu;
                  return _.extend({}, menu, {
                    id: elem,
                    sref: menu.sref || 'summary',
                  });
                }
                return null;
              }),
              function(elem) {
                return elem;
              }
            );
          },
          makeMenuSideList: function(parent) {
            function isPage(menuItem) {
              var pageExists = !1;
              return (
                _.isString(menuItem.page)
                  ? (pageExists = !!pageList[menuItem.page])
                  : _.isObject(menuItem.page) &&
                    (pageExists = !!pageList[menuItem.page['']]),
                pageExists
              );
            }

            function hasPage(menuItem, menuId) {
              if (isPage(menuItem) || menuItem.external) return !0;
              var arr = _.filter(navs, function(elem, key) {
                return key.indexOf(menuId + '.') > -1;
              });
              return _.find(arr, function(elem) {
                return isPage(elem);
              });
            }
            return _.filter(
              _.map(navs, function(elem, inx) {
                var arr = inx.split('.');
                return hasPage(elem, inx) &&
                  arr[0] == parent &&
                  2 == arr.length &&
                  !elem.hidden
                  ? _.extend({}, elem.menu, {
                      id: arr[0] + '.' + arr[1],
                      sref: elem.menu.sref || 'summary',
                      external: elem.external,
                      url: elem.url,
                    })
                  : null;
              }),
              function(elem, inx) {
                return elem;
              }
            );
          },
          makeTwoLevelMenuList: function() {
            var menuList = this.makeMenuList.apply(this, arguments);
            return (
              _.each(
                menuList,
                function(el) {
                  (el.submenu = this.makeMenuSideList(el.id)),
                    ('advanced' != el.id && 'firewall' != el.id) ||
                      0 != el.submenu.length ||
                      (menuList = _.without(menuList, el));
                },
                this
              ),
              menuList
            );
          },
        };
      },
    ]),
    app.controller('AppMobileCtrl', [
      '$rootScope',
      '$scope',
      '$http',
      '$state',
      '$window',
      '$document',
      '$timeout',
      'appSharedFuncs',
      'translate',
      'cookie',
      'navigation',
      'history',
      'ngDialog',
      'device',
      'funcs',
      'authDigest',
      'overlay-core',
      'devinfo',
      'lanIPChange',
      'eventHandler',
      'notice',
      'deviceAvailable',
      'checkFactory',
      'checkDeviceModeChange',
      function(
        $rootScope,
        $scope,
        $http,
        $state,
        $window,
        $document,
        $timeout,
        sfn,
        translate,
        cookie,
        navigation,
        history,
        ngDialog,
        device,
        funcs,
        authDigest,
        overlayCore,
        devinfo,
        lanIPChange,
        eventHandler,
        notice,
        deviceAvailable,
        checkFactory,
        checkDeviceModeChange
      ) {
        function startCheckDeviceModeChange() {
          var dialogID = null;
          checkDeviceModeChange.start(),
            $rootScope.$on('deviceModeChanged', function() {
              ngDialog.isOpen(dialogID) ||
                (dialogID = ngDialog.open({
                  template: 'dialogs/check_device_mode_change/dialog.tpl.html',
                  className: 'check_device_mode_change_dialog',
                  closeByDocument: !1,
                  closeByEscape: !1,
                  controller: 'CheckDeviceModeChangeDialogCtrl',
                  resolve: funcs.getLazyResolve(
                    'dialogs/check_device_mode_change/ctrl.lazy.js',
                    'CheckDeviceModeChangeDialogCtrl'
                  ),
                  showClose: !1,
                }).id);
            }),
            $rootScope.$on('deviceModeRestored', function() {
              ngDialog.isOpen(dialogID) && ngDialog.close(dialogID);
            });
        }

        function updateNavs() {
          var domBack = document.querySelector('#back_anchor'),
            domIcon = document.querySelector('.back_icon'),
            domTitle = document.querySelector('#title_anchor'),
            backState = $scope.backState(),
            scopeState = $scope.state();
          if (
            (domBack &&
              (domBack.innerHTML = $scope.backState()
                ? translate($scope.backState().title)
                : ''),
            domTitle &&
              scopeState &&
              (domTitle.innerHTML = translate(scopeState.title)),
            domBack && domTitle)
          ) {
            var domBackRect = domBack.getBoundingClientRect(),
              domTitleRect = domTitle.getBoundingClientRect();
            domBackRect.right > domTitleRect.left
              ? angular.element(domBack).css('visibility', 'hidden')
              : angular.element(domBack).css('visibility', 'visible');
          }
          backState
            ? angular.element(domIcon).css('visibility', 'visible')
            : (angular.element(domBack).css('visibility', 'hidden'),
              angular.element(domIcon).css('visibility', 'hidden'));
        }

        function redirect($event, toState, toParams, fromState, fromParams) {
          var paths = {
            'network.wan': 'network.wan.info',
          };
          toState.name in paths && $state.go(paths[toState.name]);
        }
        ($rootScope.overlay = {
          circular: {
            start: function() {},
            stop: function() {},
          },
          progress: {
            start: function() {},
            stop: function() {},
          },
          preloader: {
            start: function() {},
            stop: function() {},
          },
        }),
          ($scope.device = device),
          ($rootScope.pageReady = !1);
        var menus = [];
        menus.push('home'),
          menus.push('summary'),
          'undefined' != typeof ANWEB_QUICK_SETUP && menus.push('wizard'),
          'undefined' == typeof ANWEB_QUICK_SETUP && menus.push('dcc'),
          menus.push('stats'),
          menus.push('network'),
          menus.push('wifi'),
          'undefined' != typeof BR2_PACKAGE_ANWEB_PRINTSERVER &&
            menus.push('printserver'),
          'undefined' != typeof BR2_PACKAGE_ANWEB_STORAGE &&
            menus.push('storage'),
          'undefined' != typeof BR2_PACKAGE_ANWEB_USB_MODEM &&
            menus.push('usbmodem'),
          menus.push('advanced'),
          'undefined' != typeof BR2_PACKAGE_ANWEB_VOIP_PAGES &&
            menus.push('voip'),
          menus.push('firewall'),
          'undefined' != typeof BR2_PACKAGE_ANWEB_OPENVPN &&
            menus.push('openvpn'),
          menus.push('system'),
          menus.push('yandexdns'),
          'undefined' != typeof BR2_PACKAGE_ANWEB_SAFE_DNS &&
            menus.push('safedns'),
          ($scope.menuList = sfn.makeTwoLevelMenuList.apply(sfn, menus)),
          ($rootScope.mobileViewStyle = ''),
          ($scope.mobileMenuShow = !1),
          checkFactory.start(),
          startCheckDeviceModeChange(),
          history.clearAll(),
          $timeout(function() {
            angular
              .element(document.getElementsByTagName('body'))
              .removeClass('disable_transitions');
          }, 2e3),
          deviceAvailable.start(),
          $scope.$on('pageload', function() {
            $scope.pageReady = !0;
          }),
          $scope.$on('$stateChangeSuccess', function(
            event,
            state,
            params,
            fromState,
            fromParams
          ) {
            function isNeedSaveHistory(toState, fromState) {
              return toState != fromState;
            }
            ($rootScope.previousState = fromState.name),
              ($rootScope.currentState = state.name),
              ($scope.openedMenu = state.name.split('.')[0]);
            var nav = navigation[params.name ? params.name : state.name];
            if (
              (history.isCleanLastHistory() &&
                (history.remove(0, -2), history.setCleanLastHistory(!1)),
              isNeedSaveHistory(state, fromState))
            ) {
              if ('summary' != state.name && !history.getObj(-1)) {
                var snav = navigation.summary;
                history.add({
                  title: snav.title,
                  name: 'summary',
                  params: {},
                });
              }
              state.url
                ? history.add({
                    title: nav.title,
                    name: state.name,
                    params: params,
                  })
                : nav.title &&
                  history.update(
                    {
                      title: nav.title,
                    },
                    -1
                  ),
                $timeout(function() {
                  $scope.$digest(), updateNavs();
                });
            }
          }),
          ($scope.state = function() {
            return history.getObj(-1);
          }),
          ($scope.backState = function() {
            return history.getObj(-2);
          }),
          ($scope.goBackState = function() {
            var state = $scope.backState();
            state &&
              (history.setCleanLastHistory(!0),
              $state.go(state.name, state.params));
          }),
          ($scope.collapseMobileMenu = function() {
            ($rootScope.mobileViewStyle = ''),
              ($scope.mobileMenuShow = !1),
              ($scope.selectedMenu = null);
          }),
          ($scope.expandMobileMenu = function() {
            $rootScope.mobileViewStyle = 'expanded';
          }),
          ($scope.toggleMobileMenu = function() {
            ($rootScope.mobileViewStyle = $rootScope.mobileViewStyle
              ? ''
              : 'expanded'),
              ($scope.mobileMenuShow = !$scope.mobileMenuShow),
              ($scope.selectedMenu = null);
          }),
          ($scope.toggleSearchForm = function() {
            var sform = document.querySelector('.float_search_form'),
              display = angular.element(sform).css('display');
            display && 'none' != display
              ? angular.element(sform).css('display', 'none')
              : angular.element(sform).css('display', 'block');
          }),
          ($scope.logout = function($event) {
            $event.preventDefault(),
              $scope.logoutExecute ||
                (($scope.logoutExecute = !0),
                authDigest.cleanCredentials(),
                $http.get('/logout')['finally'](function() {
                  $scope.logoutExecute = !1;
                }));
          }),
          $scope.$on('changelang', function() {
            updateNavs();
          }),
          ($scope.selectFirstLevelMenu = function(menu) {
            ($scope.selectedMenu =
              $scope.selectedMenu != menu.id ? menu.id : void 0),
              menu.external && (location.href = menu.url),
              menu.openPage &&
                ($state.go(menu.sref, null, {
                  reload: !0,
                }),
                $scope.collapseMobileMenu());
          }),
          ($scope.selectSecondLevelMenu = function(menu) {
            $state.current.name == menu.id && $state.reload(),
              $scope.collapseMobileMenu();
          }),
          (function() {
            function disableScroll(e, $dialog) {
              $rootHtmlElement.addClass('disable_scroll');
            }

            function enableScroll(e, $dialog) {
              $rootHtmlElement.removeClass('disable_scroll');
            }
            var opened = [],
              $rootHtmlElement = angular.element($document[0].documentElement);
            $scope.$on('ngDialog.opened', function(e, $dialog) {
              opened.push({
                element: $dialog,
                id: $dialog.attr('id'),
              }),
                disableScroll(e, $dialog);
            }),
              $scope.$on('ngDialog.closing', function(e, $dialog) {
                var index = _.findIndex(opened, function(elem) {
                  return elem.id == $dialog.attr('id');
                });
                opened.splice(index, 1), enableScroll(e, $dialog);
              }),
              $rootScope.$on('$locationChangeStart', function(e) {
                function isNotCloseDialog(dialogs) {
                  return _.some(dialogs, function(dialog) {
                    return _.some(notCloseDialogs, function(className) {
                      return dialog.element.hasClass(className);
                    });
                  });
                }
                var notCloseDialogs = ['login_dialog'];
                return isNotCloseDialog(opened)
                  ? void e.preventDefault()
                  : void (
                      opened.length && (ngDialog.closeAll(), e.preventDefault())
                    );
              });
          })(),
          angular
            .element(document.getElementById('lblock'))
            .bind('transitionend', updateNavs),
          angular.element($window).bind('resize', updateNavs),
          devinfo.skipAuth.once('version').then(function(data) {
            data &&
              (($scope.deviceInfo = data),
              data.lang && translate.changeLanguage(data.lang));
          }),
          $rootScope.$on('$stateChangeSuccess', redirect);
      },
    ]);
})();
