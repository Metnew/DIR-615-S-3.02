'use strict';
!(function() {
  function TroubleCtrl(
    $scope,
    $rootScope,
    $window,
    devinfo,
    $state,
    navigation,
    troubleCheck,
    $timeout,
    translate,
    overlay,
    queryString
  ) {
    function changeURL(url) {
      ($window.location.href = url),
        overlay.simple.start({
          action: 'wait.redirect',
        });
    }

    function isURL(str) {
      if (!str) return !1;
      var urlRegex =
          '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
        url = new RegExp(urlRegex, 'i');
      return str.length < 2083 && url.test(str);
    }

    function isPath(str) {
      return '/' == str[0];
    }

    function getFinishURL() {
      return queryString.finishURL
        ? queryString.finishURL
        : queryString.redirecturl
          ? queryString.redirecturl
          : 'connected';
    }
    var checkCount = 0,
      checkCountMax = 2,
      finishURL = getFinishURL();
    devinfo.init({
      need_auth: !1,
    }),
      devinfo.once('version|ports|box|net').then(function(data) {
        if (data) {
          var ifacetype = null;
          data.ipv4gw
            ? (ifacetype = data.ipv4gw.ifacetype)
            : data.ipv6gw && (ifacetype = data.ipv6gw.ifacetype),
            ($scope.title = data.modelName),
            ($scope.DSLMode =
              'DSL' == data.deviceClass && 'ethernet' != ifacetype),
            ($rootScope.rootAvailPorts = data.availPorts),
            ($rootScope.rootGWIface = ifacetype),
            ($rootScope.rootBoxInfo =
              data.boxInfo && _.size(data.boxInfo.ports)
                ? data.boxInfo
                : {
                    ports: ['internet', 'port1', 'port2', 'port3', 'port4'],
                  }),
            translate.changeLanguage(data.lang),
            $state.go('wait').then(function() {
              overlay.simple.stop({
                action: 'loading',
              }),
                ($scope.isLoaded = !0);
            });
        }
      }),
      ($scope.isButton = function(btn) {
        var name = $state.$current.name,
          nav = navigation[name];
        return nav && nav.buttons.indexOf(btn) >= 0;
      }),
      ($scope.onExitBtnClick = function() {
        $window.location.href = '/';
      }),
      ($scope.onCheckBtnClick = function() {
        $state.go('wait');
      }),
      ($scope.onApplyBtnClick = function() {
        $timeout(function() {
          $scope.$broadcast('goToErrorForm', !0), $scope.$broadcast('apply');
        });
      }),
      ($scope.onAwayBtnClick = function() {
        var url = queryString.redirecturl
          ? queryString.redirecturl
          : 'www.yandex.com';
        changeURL(isPath(url) ? url : 'http://' + url);
      }),
      ($scope.checkSiteURL = function() {
        return !0;
      }),
      ($scope.showNextError = function() {
        checkCount++,
          troubleCheck.getNextStatus(function(status) {
            var promise;
            checkCountMax >= checkCount || 'connected' == status
              ? 'connected' == status && (isURL(finishURL) || isPath(finishURL))
                ? (console.log('finishURL', finishURL), changeURL(finishURL))
                : (promise = $state.go(status))
              : ((promise = $state.go('failed')), (checkCount = 0)),
              promise &&
                promise.then(function() {
                  overlay.simple.stop({
                    action: 'loading',
                  }),
                    ($scope.isLoaded = !0);
                });
          });
      }),
      ($window.location.href = '#/loading'),
      overlay.simple.start({
        action: 'loading',
      });
  }
  appDeps = appDeps.concat([
    'nw',
    'app.config',
    'ui.router',
    'app-module-funcs',
    'dcc.device',
    'ngDialog',
  ]);
  var app = angular.module('trouble', appDeps);
  app.constant('fieldConfig', {
    style: 'material',
  }),
    app.config([
      '$stateProvider',
      '$injector',
      'pageList',
      '$urlRouterProvider',
      'navigation',
      'ngDialogProvider',
      function(
        $stateProvider,
        $injector,
        pageList,
        $urlRouterProvider,
        navigation,
        ngDialogProvider
      ) {
        _.each(navigation, function(elem, inx) {
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
        }),
          ngDialogProvider.setDefaults({
            closeByDocument: !1,
            showClose: !1,
          });
        var somovd = $injector.get('somovdProvider');
        somovd.somovdEndPoint = '/jsonrpc';
        var authDigestProvider = $injector.get('authDigestProvider');
        (authDigestProvider.authHeaderName = 'anweb-authenticate'),
          (authDigestProvider.autologinHeaderName =
            'anweb-auth-autologin-available'),
          (authDigestProvider.repeatRequestHeaderName = 'anweb-repeat-request'),
          (authDigestProvider.deviceSessionHeaderName = 'device-session-id'),
          (authDigestProvider.authDefaultUsername = 'admin'),
          (authDigestProvider.authDefaultPassword = 'admin'),
          (authDigestProvider.getCredentialsCallback = [
            'ngDialog',
            'authParams',
            function(ngDialog, authParams) {
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
            },
          ]);
      },
    ]),
    app.directive('nwPorts', [
      'translate',
      function(translate) {
        return {
          restrict: 'AEC',
          scope: {
            nwBoxInfo: '=',
            nwAvailPorts: '=',
            nwGwIface: '=',
            nwOtherIfaces: '=',
            nwPortClick: '&',
            nwWanStatus: '=',
            nwLanStatus: '=',
            nwManagement: '=',
            nwAutoShift: '=',
            nwServices: '=',
            nwServicesMenu: '=',
            nwServicesChange: '&',
            nwEtherwanPort: '=',
            nwRewriteTooltip: '&',
            nwRewriteIcon: '&',
            nwHighlight: '=',
          },
          template:
            '<div class="prots2-wifi" ng-if="showAdditioanlPort(\'wifi\')">                     <div class="anten" ng-class="{\'selected\': highlightGroup(\'wifi\')}">                     </div>                 </div>                 <div class="ports2" ng-class="{ \'with_status\': !!nwLanStatus || !!nwWanStatus }"> 					<div class="group usb" ng-class="{\'selected\': highlightGroup(\'usb\')}" ng-if="showAdditioanlPort(\'usb\')">                         <div class="port usb">                             <div class="bg"></div>                         </div>     			    	<div class="name">{{ \'USB\' }}</div>                     </div>                     <div class="group {{group.type.toLowerCase()}}" ng-class="{\'selected\': highlightGroup(group.type.toLowerCase())}" ng-repeat="group in groups"> 						<div class="port {{ getPhyIcon(port) }}" ng-repeat="port in group.ports" ng-click="nwPortClick({ \'port\': port })" title="{{ seviceToHuman(services[port.name].service, port) }}"> 							<div class="bg {{ getPhyIcon(port) }}"></div> 							<div class="icon {{ port.icon }} {{ seviceToIcon(services[port.name].service, port) }} {{ (port.management && nwManagement)?\'human\':\'\' }} {{(group.type == \'LAN\')?\'pointer\':\'\'}}"></div> 							<div class="connect {{ getPhyIcon(port) }}" ng-class="{\'on\': port.status}" ng-if="isShowPortStatus(group.type, port)"> 								<div></div> 							</div> 							<div class="name" ng-if="group.ports.length > 1">{{ port.number }}</div> 							<select ng-if="isShowServiceList(group, port)" ng-options="option.value as option.name for option in nwServicesMenu" ng-model="services[port.name].service" ng-change="onServiceChange(port)"> 							</select> 						</div> 						<div class="name">{{ group.alias?group.alias:group.type }}</div> 					</div> 				</div>',
          link: function($scope, $element, $attr) {
            function getTypeByName(name) {
              return /WAN|internet|port5/.test(name)
                ? 'Internet'
                : /LAN\d|port\d/.test(name)
                  ? 'LAN'
                  : 'undefined';
            }

            function getNumberByName(name) {
              var result = /[a-zA-Z]+(\d+)/.exec(name);
              return 2 == _.size(result) ? _.last(result) : '';
            }

            function isLanGroup(group) {
              return 'LAN' == group.type;
            }

            function isEtherWANPort(port) {
              return _.isString($scope.nwEtherwanPort)
                ? port.name == $scope.nwEtherwanPort
                : void 0;
            }

            function createGroups(boxPorts) {
              function getDefIcon(type) {
                return 'Internet' == type ? 'internet' : '';
              }
              var result = [],
                lastType = null,
                group = null;
              return (
                _.each(boxPorts, function(portName) {
                  var port = {
                      name: portName,
                    },
                    number = null,
                    type = getTypeByName(portName);
                  'Internet' != type && (number = getNumberByName(portName)),
                    type != lastType &&
                      (result.push({
                        type: type,
                        icon: getDefIcon(type),
                        ports: [],
                      }),
                      (group = _.last(result))),
                    group.ports.push(
                      _.extend(port, {
                        number: number,
                      })
                    ),
                    (lastType = type);
                }),
                result
              );
            }

            function updateGroups(availPorts) {
              function convertIface(iface) {
                switch (iface) {
                  case 'atm':
                  case 'ptm':
                    return 'dsl';
                }
                return iface;
              }

              function convertType(type) {
                switch (type) {
                  case 'fiber':
                    return 'ethernet';
                }
                return type;
              }
              useEtherwan = !1;
              var obj = _.indexBy(availPorts, 'name');
              if (
                (_.each($scope.groups, function(group) {
                  _.each(group.ports, function(port) {
                    obj[port.name] &&
                      ('dsl' == obj[port.name].type && (group.alias = 'DSL'),
                      obj[port.name].alias &&
                        (group.alias = obj[port.name].alias),
                      (port.group = group),
                      (port.status = obj[port.name].status),
                      (port.isWan = $scope.nwGwIface
                        ? obj[port.name].isWan &&
                          convertType(obj[port.name].type) ==
                            convertIface($scope.nwGwIface)
                        : obj[port.name].isWan),
                      (port.isEtherwan = obj[port.name].isEtherwan),
                      (port.management = !!obj[port.name].management),
                      (port.type = obj[port.name].type),
                      obj[port.name].isEtherwan && (useEtherwan = !0));
                  });
                }),
                $scope.nwAutoShift)
              ) {
                var lan = _.find($scope.groups, function(group) {
                  return 'LAN' == group.type;
                });
                if (lan) {
                  var mgmPort = _.find(lan.ports, function(port) {
                    return port.management;
                  });
                  if (mgmPort) {
                    var freePort = null;
                    if (
                      ((freePort = $scope.nwServices
                        ? _.find($scope.nwServices, function(port) {
                            return !port.service && !isEtherWANPort(port);
                          })
                        : _.find(lan.ports, function(port) {
                            return !isEtherWANPort(port);
                          })),
                      $scope.nwServices)
                    ) {
                      var servPort = _.find($scope.nwServices, function(port) {
                        return !!port.service && port.name == mgmPort.name;
                      });
                      servPort &&
                        (freePort &&
                          ((freePort.service = servPort.service),
                          console.log(
                            'Service',
                            servPort.service,
                            'moved to',
                            freePort.name
                          )),
                        (servPort.service = ''));
                    }
                    $scope.nwEtherwanPort == mgmPort.name &&
                      freePort &&
                      (($scope.nwEtherwanPort = freePort.name),
                      console.log('Etherwan moved to', freePort.name));
                  }
                }
              }
            }
            ($scope.groups = []), ($scope.services = {});
            var useEtherwan = !1;
            ($scope.getPhyIcon = function(port) {
              if (
                (port.group && 'Internet' == port.group.type) ||
                'internet' == port.name
              )
                switch (port.type) {
                  case 'dsl':
                    return 'dsl';
                  case 'pon':
                    return 'optical';
                  case 'fiber':
                    return 'fiber';
                }
              return '';
            }),
              ($scope.isShowServiceList = function(group, port) {
                return (
                  $scope.nwServicesMenu &&
                  isLanGroup(group) &&
                  !isEtherWANPort(port) &&
                  !port.management
                );
              }),
              ($scope.isShowPortStatus = function(type, port) {
                return $scope.nwWanStatus && port.isWan
                  ? !0
                  : $scope.nwLanStatus && 'LAN' == type;
              }),
              ($scope.onServiceChange = function(port) {
                $scope.nwServicesChange &&
                  $scope.nwServicesChange({
                    port: port,
                  });
              }),
              ($scope.seviceToIcon = function(service, port) {
                if ($attr.nwRewriteIcon) {
                  var icon = $scope.nwRewriteIcon({
                    port: port,
                  });
                  if (null !== icon) return icon;
                }
                if (
                  _.isString($scope.nwEtherwanPort) &&
                  ($scope.nwEtherwanPort == port.name ||
                    ('' == $scope.nwEtherwanPort && port.isWan))
                )
                  return 'internet';
                if (!service) return '';
                switch (service.toLowerCase()) {
                  case '':
                    return '';
                  case 'iptv':
                    return 'iptv';
                  case 'voip':
                    return 'voip';
                  default:
                    return 'tvtel';
                }
              }),
              ($scope.seviceToHuman = function(service, port) {
                if ($attr.nwRewriteTooltip) {
                  var tooltip = $scope.nwRewriteTooltip({
                    port: port,
                  });
                  if (null !== tooltip) return translate(tooltip);
                }
                if (
                  _.isString($scope.nwEtherwanPort) &&
                  ((_.isEmpty($scope.nwEtherwanPort) && port.isWan) ||
                    $scope.nwEtherwanPort == port.name)
                )
                  return translate('wizard_inet_port');
                if (!service) return '';
                switch (service.toLowerCase()) {
                  case '':
                    return '';
                  case 'iptv':
                    return 'IPTV';
                  case 'voip':
                    return 'VoIP';
                  default:
                    return 'IPTV+VoIP';
                }
              }),
              ($scope.highlightGroup = function(group) {
                return $scope.nwHighlight == group;
              }),
              $scope.$watch('nwBoxInfo', function(boxInfo) {
                !_.size($scope.groups) &&
                  boxInfo &&
                  ($scope.groups = createGroups(boxInfo.ports));
              }),
              $scope.$watch(
                function() {
                  return JSON.stringify($scope.nwServices);
                },
                function() {
                  $scope.nwServices &&
                    ($scope.services = _.indexBy($scope.nwServices, 'name'));
                }
              ),
              $scope.$watchCollection('nwAvailPorts', function(availPorts) {
                availPorts && updateGroups(availPorts, $scope.nwOtherIfaces);
              }),
              ($scope.showAdditioanlPort = function(type) {
                return (
                  !!$scope.nwOtherIfaces &&
                  _.contains($scope.nwOtherIfaces, type)
                );
              });
          },
        };
      },
    ]),
    app.controller('TroubleCtrl', [
      '$scope',
      '$rootScope',
      '$window',
      'devinfo',
      '$state',
      'navigation',
      'troubleCheck',
      '$timeout',
      'translate',
      'overlay-core',
      'queryString',
      TroubleCtrl,
    ]);
})();
