'use strict';
!(function() {
  var app = angular.module(regdep('wizard-services'), []);
  app.constant('fieldConfig', { style: 'material' }),
    app.constant('navigation', {
      loading: { url: '/loading' },
      lang: { page: 'wizardLang', url: '/lang' },
      info: { page: 'wizardInfo', url: '/info?next&skip' },
      geo: { page: 'wizardGeo', url: '/geo' },
      search: { page: 'wizardSearch', url: '/search' },
      search_fail: { page: 'wizardSearchFail', url: '/search_fail' },
      master: { page: 'wizardMaster', url: '/master' },
      provlist: { page: 'wizardProvList', url: '/provlist?index' },
      servicelist: { page: 'wizardServiceList', url: '/servicelist' },
      summary: { page: 'wizardSummary', url: '/summary?prev' },
      status: {
        page: 'wizardStatus',
        url: '/status?step&prev&prev_action&error',
      },
      reboot_status: {
        page: 'wizardRebootStatus',
        url: '/reboot_status?next&action&nocheck',
      },
      notdefault: { page: 'wizardNotDefault', url: '/notdefault' },
      checkcable: { page: 'wizardCheckCable', url: '/checkcable?next&prev' },
      trouble: { page: 'wizardTrouble', url: '/trouble?finishUrl&finishParam' },
      trstatus: { page: 'wizardTRStatus', url: '/trstatus' },
      wifiwarn: { page: 'wizardWiFiWarn', url: '/wifiwarn' },
      reset: { page: 'wizardReset', url: '/reset' },
      startwizard: { page: 'wizardStartWizard', url: '/startwizard?next&prev' },
      manual: { page: 'wizardManual', url: '/manual?prev_action&prev' },
      skipwizard: { page: 'wizardSkipWizard', url: '/skipwizard?next&prev' },
      finish: { page: 'wizardFinish', url: '/finish?net' },
      password: { page: 'wizardPassword', url: '/password' },
      startstate: { page: 'wizardStartState', url: '/startstate' },
      voip_trouble: {
        page: 'wizardVoIPTrouble',
        url: '/voip_trouble?finishUrl',
      },
      allstatus: { page: 'wizardAllStatus', url: '/allstatus' },
      checkphone: { page: 'wizardCheckPhone', url: '/checkphone' },
      services: { page: 'wizardServices', url: '/services' },
      defaults: { page: 'wizardDefaults', url: '/defaults' },
    }),
    app.directive('nwAutofocus', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          link: function($scope, $element) {
            $timeout(function() {
              $element[0].focus();
            });
          },
        };
      },
    ]),
    app.directive('nwScroll', function() {
      return {
        restrict: 'AEC',
        scope: { nwScroll: '=' },
        link: function($scope, $element, $attr) {
          $scope.$watch('nwScroll', function(val) {
            val &&
              setTimeout(function() {
                window.scrollTo(0, $element[0].offsetTop - 180);
              });
          });
        },
      };
    }),
    app.directive('nwPorts', [
      'translate',
      function(translate) {
        return {
          restrict: 'AEC',
          scope: {
            nwBoxInfo: '=',
            nwAvailPorts: '=',
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
            '<div class="prots2-wifi" ng-if="showAdditioanlPort(\'wifi\')">                     <div class="anten" ng-class="{\'selected\': highlightGroup(\'wifi\')}">                     </div>                 </div>                 <div class="ports2" ng-class="{ \'with_status\': !!nwLanStatus || !!nwWanStatus }"> 					<div class="group usb" ng-class="{\'selected\': highlightGroup(\'usb\')}" ng-if="showAdditioanlPort(\'usb\')">                         <div class="port usb">                             <div class="bg"></div>                         </div>     			    	<div class="name">{{ \'USB\' }}</div>                     </div>                     <div class="group {{group.type.toLowerCase()}}" ng-class="{\'selected\': highlightGroup(group.type.toLowerCase())}" ng-repeat="group in groups"> 						<div class="port {{ getPhyIcon(port) }}" ng-repeat="port in group.ports" ng-click="nwPortClick({ \'port\': port })" title="{{ seviceToHuman(services[port.name].service, port) }}"> 							<div class="bg {{ getPhyIcon(port) }}"></div> 							<div class="icon {{ port.icon }} {{ seviceToIcon(services[port.name].service, port) }} {{ (port.management && nwManagement)?\'human\':\'\' }} {{(group.type == \'LAN\')?\'pointer\':\'\'}}"></div> 							<div class="connect {{ getPhyIcon(port) }}" ng-class="{\'on\': port.status}" ng-if="isShowPortStatus(group.type, port)"> 								<div></div> 							</div> 							<div class="name">{{ port.number }}</div> 							<select ng-if="isShowServiceList(group, port)" ng-options="option.value as option.name for option in nwServicesMenu" ng-model="services[port.name].service" ng-change="onServiceChange(port)"> 							</select> 						</div> 						<div class="name">{{ group.alias?group.alias:group.type }}</div> 					</div> 				</div>',
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
                  var port = { name: portName },
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
                    group.ports.push(_.extend(port, { number: number })),
                    (lastType = type);
                }),
                result
              );
            }
            function updateGroups(availPorts) {
              useEtherwan = !1;
              var obj = _.indexBy(availPorts, 'name');
              if (
                (_.each($scope.groups, function(group) {
                  _.each(group.ports, function(port) {
                    obj[port.name] &&
                      ('dsl' == obj[port.name].type && (group.alias = 'DSL'),
                      (port.group = group),
                      (port.status = obj[port.name].status),
                      (port.isWan = obj[port.name].isWan),
                      (port.isEtherwan = obj[port.name].isEtherwan),
                      (port.management = !!obj[port.name].management),
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
              return (
                (port.group && 'Internet' == port.group.type) ||
                  'internet' == port.name,
                ''
              );
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
                return $scope.nwWanStatus && 'internet' == port.name
                  ? !0
                  : $scope.nwWanStatus &&
                    port &&
                    ((useEtherwan && port.isEtherwan) ||
                      (!useEtherwan && port.isWan))
                    ? !0
                    : $scope.nwLanStatus && 'LAN' == type;
              }),
              ($scope.onServiceChange = function(port) {
                $scope.nwServicesChange &&
                  $scope.nwServicesChange({ port: port });
              }),
              ($scope.seviceToIcon = function(service, port) {
                if ($attr.nwRewriteIcon) {
                  var icon = $scope.nwRewriteIcon({ port: port });
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
                  var tooltip = $scope.nwRewriteTooltip({ port: port });
                  if (null !== tooltip) return translate(tooltip);
                }
                if (
                  _.isString($scope.nwEtherwanPort) &&
                  ((_.isEmpty($scope.nwEtherwanPort) && port.isWan) ||
                    $scope.nwEtherwanPort == port.name)
                )
                  return translate('wizard_inet_port');
                if ($scope.nwManagement && port.management)
                  return translate('on_this_port');
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
    app.directive('nwIncludeCache', [
      '$http',
      '$templateCache',
      function($http, $templateCache) {
        return {
          restrict: 'AEC',
          scope: { nwIncludeCache: '=' },
          template: '',
          link: function($scope) {
            var url = $scope.nwIncludeCache;
            url &&
              $http.get(url).then(function(response) {
                response &&
                  200 == response.status &&
                  $templateCache.put(url, response.data);
              });
          },
        };
      },
    ]),
    app.directive('nwCircles', [
      '$rootScope',
      function($rootScope) {
        return {
          restrict: 'AEC',
          scope: {
            nwCircles: '=',
            nwCirclesPause: '=',
            nwCirclesCallback: '&',
          },
          template: '<div class="mycircle_wrap"></div>',
          link: function($scope, $element, $attr) {
            function callback(status) {
              $scope.nwCirclesCallback &&
                $scope.nwCirclesCallback({ status: status });
            }
            var intervalID,
              paused = !1;
            $scope.$watch('nwCirclesPause', function(isPaused) {
              paused = !!isPaused;
            }),
              $scope.$watch('nwCircles', function(progress_max) {
                if (
                  (callback('started'),
                  progress_max && parseInt(progress_max) >= 0)
                ) {
                  var circles,
                    circle_count,
                    progress_max,
                    progress,
                    i,
                    lastStamp;
                  !(function() {
                    var calcApplyCircleMargin = function(index) {
                        return Math.min(
                          ((progress -
                            (progress_max / circle_count) * (index + 1)) /
                            (progress_max / 10)) *
                            11,
                          0
                        );
                      },
                      calcApplyCircleShow = function(index) {
                        return (
                          progress >= (progress_max / circle_count) * index
                        );
                      };
                    for (
                      circles = $element.find('div')[0],
                        circle_count = 10,
                        progress_max = parseInt($scope.nwCircles),
                        progress = 0,
                        angular.element(circles).empty(),
                        i = 0;
                      circle_count > i;
                      i++
                    )
                      angular
                        .element(circles)
                        .append(
                          '<span class="circle"><div class="bg"></div></span>'
                        );
                    (lastStamp = _.now()),
                      (intervalID = setInterval(function() {
                        if (!paused) {
                          (progress += _.now() - lastStamp),
                            (lastStamp = _.now());
                          var circlesArray = angular
                            .element(circles)
                            .find('div');
                          if (!circlesArray || 0 == circlesArray.length)
                            return void clearTimeout(intervalID);
                          for (var i = 0; circle_count > i; i++)
                            angular
                              .element(circlesArray[i])
                              .css(
                                'margin-left',
                                calcApplyCircleMargin(i) + 'px'
                              ),
                              angular
                                .element(circlesArray[i])
                                .css(
                                  'display',
                                  calcApplyCircleShow(i) ? 'block' : 'none'
                                );
                          progress >= progress_max &&
                            ($rootScope.$broadcast('cricle_bar_finished'),
                            clearTimeout(intervalID),
                            callback('finished'));
                        }
                      }, 200));
                  })();
                } else clearTimeout(intervalID);
              });
          },
        };
      },
    ]),
    app.directive('nwStepCircles', [
      '$interval',
      function($interval) {
        return {
          restrict: 'AEC',
          scope: {
            nwStepCirclesCount: '=',
            nwStepCirclesValue: '=',
            nwAutoAnim: '=',
            nwAutoAnimFinished: '&',
            nwAutoAnimTick: '&',
          },
          template:
            '<div class="mycircle_wrap"> 					<span class="circle" ng-repeat="i in count"> 						<div ng-if="!nwAutoAnim" class="bg" ng-style="{display: (nwStepCirclesValue > i)?\'block\':\'none\'}"></div> 						<div ng-if="nwAutoAnim" class="bg" ng-style="{display: (incr > i)?\'block\':\'none\'}"></div> 					</span> 				</div>',
          link: function($scope, $element, $attr) {
            if (
              (($scope.count = _.range($scope.nwStepCirclesCount)),
              ($scope.incr = 0),
              $scope.nwAutoAnim)
            ) {
              var intervalID = $interval(function() {
                $scope.nwAutoAnimTick &&
                  $attr.nwAutoAnimTick &&
                  $scope.nwAutoAnimTick(),
                  $scope.incr++,
                  $scope.nwAutoAnimFinished &&
                  $attr.nwAutoAnimFinished &&
                  $scope.incr == $scope.nwStepCirclesCount
                    ? ($interval.cancel(intervalID),
                      $scope.nwAutoAnimFinished())
                    : $scope.incr > $scope.nwStepCirclesCount &&
                      ($scope.incr = 0);
              }, 2e3);
              $scope.$on('$destroy', function() {
                $interval.cancel(intervalID);
              });
            }
          },
        };
      },
    ]),
    app.directive('nwMasterContainer', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'AEC',
          link: function($scope, $element, $attr) {
            function recheck() {
              var elem = $element.children().eq(1);
              0 == elem[0].clientHeight
                ? $element.addClass('single')
                : $element.removeClass('single');
            }
            var updateInterval = setInterval(function() {
              recheck();
            }, 200);
            $scope.$on('$destroy', function() {
              clearInterval(updateInterval);
            });
          },
        };
      },
    ]),
    app.directive('nwCheckboxField', function() {
      return {
        restrict: 'AEC',
        link: function($scope, $element, $attr) {
          $element.addClass('checkbox_field');
          var input = $element.find('input');
          if ('checkbox' == input.attr('type')) {
            var label = _.find($element.find('div'), function(dom) {
              return angular.element(dom).hasClass('nwfield_label');
            });
            if (label) {
              var uniq = _.uniqueId('nw_field_uniq_');
              angular
                .element(label)
                .wrap('<label>')
                .parent()
                .attr('for', uniq),
                input.attr('id', uniq);
            }
          }
        },
      };
    }),
    app.directive('nwWizardCheckbox', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'AEC',
          scope: { ngModel: '=', ngDisabled: '=', ngChange: '&' },
          template:
            '<div class="checkbox" ng-class="{\'on\': ngModel, \'disabled\': ngDisabled}" ng-click="toggle($event); $event.stopPropagation();"></div>',
          link: function($scope, $element, $attr) {
            $scope.toggle = function($event) {
              $scope.ngDisabled ||
                (($scope.ngModel = !$scope.ngModel),
                _.isFunction($scope.ngChange) &&
                  $timeout(function() {
                    return $scope.ngChange({ $event: $event });
                  }));
            };
            var parent = $element.parent();
            parent.hasClass('checkbox_wrap') &&
              parent.on('click', function($event) {
                $event.stopPropagation(),
                  $scope.$apply(function() {
                    $scope.toggle();
                  });
              });
          },
        };
      },
    ]),
    app.service('regions', [
      '$http',
      function($http) {
        function byID(id) {
          return _list[id];
        }
        function byParent(id) {
          return _.filter(_list, function(elem) {
            return elem.Parent == id;
          });
        }
        function byGeo(coord) {
          function distance(p1, p2) {
            return Math.abs(
              Math.sqrt(
                (p1[0] - p2[0]) * (p1[0] - p2[0]) +
                  (p1[1] - p2[1]) * (p1[1] - p2[1])
              )
            ).toFixed(3);
          }
          prepare = _.map(_list, function(region) {
            if (region.Geo) {
              var region_coord = _.map(region.Geo.split(','), parseFloat);
              region.__distance = distance(coord, region_coord);
            } else region.__distance = 1 / 0;
            return region;
          });
          var prepare = _.sortBy(prepare, function(region) {
            return region.__distance;
          });
          return _.first(prepare);
        }
        function getParent(index) {
          var region = byID(index);
          return region && _.isNumber(region.Parent) && region.Parent > 0
            ? region.Skip
              ? getParent(region.Parent)
              : getName(region) + ', ' + getParent(region.Parent)
            : region && region.Skip
              ? ''
              : getName(region);
        }
        function getName(region) {
          return region
            ? region.LocalName
              ? region.LocalName
              : region.Name
            : '';
        }
        function findTZ(id) {
          var region = byID(id);
          if (region)
            do {
              if (!region.Parent) return;
              if (region.TZ)
                return console.log('timezone found in', region), region.TZ;
              region = byID(region.Parent);
            } while (region);
        }
        function prepare() {
          if (1 == _.size(_list))
            (_isSingleProfile = !0),
              (singleProfileID = _.first(_.values(_list)).ID);
          else
            for (;;) {
              var elems = byParent(baseRegionID);
              {
                if (1 != _.size(elems)) {
                  if (0 == _.size(elems)) {
                    (_isSingleProfile = !0), (singleProfileID = baseRegionID);
                    break;
                  }
                  break;
                }
                baseRegionID = _.first(elems).ID;
              }
            }
        }
        var path = '/regions.json',
          _list = {},
          _isSingleProfile = !1,
          singleProfileID = null,
          baseRegionID = 0;
        return {
          load: function(cb) {
            _list.length
              ? cb(_list)
              : $http({ url: path + '?_=' + Math.random() }).then(function(
                  res
                ) {
                  (_list = _.indexBy(res.data, 'ID')),
                    _.each(_list, function(region, index) {
                      (region.__name = getName(region)),
                        (region.__fullname = region.__name),
                        _.isNumber(region.Parent) && region.Parent > 0
                          ? ((region.__parent = getParent(region.Parent)),
                            (region.__fullname =
                              region.__fullname + ', ' + region.__parent))
                          : (region.__parent = '');
                    }),
                    prepare(),
                    cb(_list);
                });
          },
          list: function() {
            return _list;
          },
          isSingleProfile: function() {
            return _isSingleProfile;
          },
          getSingleProfileID: function() {
            return singleProfileID;
          },
          getBaseRegionID: function() {
            return baseRegionID;
          },
          byID: byID,
          byParent: byParent,
          byGeo: byGeo,
          findTZ: findTZ,
        };
      },
    ]),
    app.service('profiles', [
      '$http',
      'endpointConfig',
      function($http, endpointConfig) {
        function load(region_id, cb) {
          $http({
            url: endpointConfig.dcc_get_rofiles,
            params: { region_id: region_id },
          }).then(function(res) {
            cb && cb(res.data);
          });
        }
        function apply(profile, cb, disableFork) {
          disableFork && (profile.DisableFork = !0),
            $http({
              url: endpointConfig.dcc_apply,
              method: 'POST',
              data: profile,
            })
              .then(function(res) {
                cb && cb(res);
              })
              ['catch'](function(res) {
                cb && cb(res);
              });
        }
        function update_gwif_connection(data, version, cb) {
          return $http({
            url: endpointConfig.dcc_update_gwif_connection,
            method: 'POST',
            data: { data: data, version: version },
          });
        }
        return {
          load: load,
          apply: apply,
          update_gwif_connection: update_gwif_connection,
        };
      },
    ]),
    app.service('bitStatus', function() {
      function toStatus(profile) {
        var n = 0;
        n |= bitMap.IsSave;
        for (var i in profile.Config) n |= bitMap[i];
        return n;
      }
      function toFields(status) {
        var res = {};
        for (var i in bitMap) res[i] = !!(status & bitMap[i]);
        return res;
      }
      var bitMap = {
        IsSave: 1,
        WAN: 2,
        VLAN: 4,
        GroupingInterfaces: 4,
        WiFi: 8,
        TR69: 16,
        RemoteUpdate: 32,
        RemoteAccess: 64,
        SystemLang: 128,
        SystemTime: 256,
        Password: 512,
      };
      return { toStatus: toStatus, toFields: toFields };
    }),
    app.service('dataShare', function($rootScope) {
      var service = {},
        data = {};
      return (
        (service.set = function(key, val) {
          data[key] = val;
        }),
        (service.get = function(key) {
          return data[key];
        }),
        (service.isSet = function(key) {
          return !!data[key];
        }),
        (service.remove = function(key) {
          delete data[key];
        }),
        (service.setIfEmpty = function(key, val) {
          return data[key] || service.set(key, val), data[key];
        }),
        service
      );
    }),
    app.service('autoupdate', [
      '$q',
      '$http',
      'devinfo',
      'somovd',
      'endpointConfig',
      function($q, $http, devinfo, somovd, endpointConfig) {
        function support() {
          var deferred = $q.defer();
          return (
            somovd
              .read(178)
              .then(function(res) {
                res && 20 == res.status
                  ? deferred.resolve()
                  : deferred.reject();
              })
              ['catch'](function() {
                deferred.reject();
              }),
            deferred.promise
          );
        }
        function check() {
          var deferred = $q.defer();
          return (
            somovd
              .write(178, { check_updates: !0 })
              .then(function(res) {
                if (res && 20 == res.status) {
                  var data = res.data;
                  console.log('update status:', data.status),
                    data && 'update_available' == data.status
                      ? deferred.resolve(data)
                      : deferred.reject();
                } else deferred.reject();
              })
              ['catch'](function() {
                deferred.reject();
              }),
            deferred.promise
          );
        }
        function start() {
          var deferred = $q.defer();
          return (
            $http({ method: 'POST', url: endpointConfig.dcc_remote_update })
              .then(function(res) {
                if (200 == res.status) {
                  var data = res.data.result;
                  data && data.duration
                    ? deferred.resolve(data)
                    : deferred.reject();
                } else deferred.reject();
              })
              ['catch'](function() {
                deferred.reject();
              }),
            deferred.promise
          );
        }
        return { support: support, check: check, start: start };
      },
    ]),
    angular.module('wizard').service('dongle', [
      'somovd',
      '$q',
      function(somovd, $q) {
        function applyPIN(pin) {
          var defered = $q.defer(),
            data = { pin: pin, newpin: '', pinoff: 1 };
          return (
            somovd
              .write(135, data)
              .then(function(res) {
                55 != res.status && 65 != res.status
                  ? defered.resolve(!0)
                  : defered.reject();
              })
              ['catch'](function() {
                defered.reject();
              }),
            defered.promise
          );
        }
        function cleanInfo() {
          (dongleState = ''), (dongleInfo = {});
        }
        var dongleState = '',
          dongleInfo = {};
        return {
          cleanInfo: cleanInfo,
          applyPIN: applyPIN,
          state: function(val) {
            return (
              val && ((dongleState = val), console.log('STATE is:', val)),
              dongleState
            );
          },
          info: function(val) {
            return val && (dongleInfo = val), dongleInfo;
          },
        };
      },
    ]),
    angular.module('wizard').service('stepManager', [
      '$q',
      '$rootScope',
      'stepMap',
      '$state',
      function($q, $rootScope, stepMap, $state) {
        function init(data, cb) {
          var promise = stepMap.$init(data);
          return (
            promise.then(function(data) {
              (activeStep = data.step),
                $state.go(stepMap[activeStep].page, data.args)['finally'](cb);
            }),
            promise
          );
        }
        function action(event, data, finish) {
          var deferred = $q.defer(),
            func = stepMap[activeStep].action;
          if (!func)
            return void console.error(
              'Action callback is undefined in',
              '"' + activeStep + '"'
            );
          var promise = func(event, data);
          return promise
            ? (promise.then(function(result) {
                (activeStep = result.step),
                  (polify = !1),
                  $state
                    .go(stepMap[activeStep].page, result.args)
                    ['finally'](function() {
                      (polify = !0), activate(), deferred.resolve();
                    });
              }),
              deferred.promise)
            : void console.error(
                'Undefined event',
                '"' + event + '" in "' + activeStep + '"'
              );
        }
        function getData() {
          return stepMap[activeStep].data;
        }
        function isPath(str) {
          return str && '/' == str[0];
        }
        function activate() {
          activeStep &&
            stepMap[activeStep].activate &&
            stepMap[activeStep].activate();
        }
        function getAwayURL() {
          return isPath(stepMap.$awayURL)
            ? stepMap.$awayURL
            : 'http://' + stepMap.$awayURL;
        }
        var activeStep = null,
          polify = !0;
        return (
          $rootScope.$on('$stateChangeSuccess', function(event, state) {
            if (polify) {
              var foundPair = _.find(_.pairs(stepMap), function(stepPair) {
                return stepPair[1].page == state.name;
              });
              foundPair && ((activeStep = foundPair[0]), activate());
            }
          }),
          {
            init: init,
            getData: getData,
            getAwayURL: getAwayURL,
            action: action,
          }
        );
      },
    ]),
    angular.module('wizard').service('profileInspector', function() {
      var profile,
        obj = {};
      return (
        (obj.set = function(nativeProfile) {
          profile = nativeProfile;
        }),
        (obj.containEtherWAN = function() {
          return profile && _.isObject(profile.Config.EtherWAN);
        }),
        (obj.containWAN = function() {
          return profile && _.isObject(profile.Config.WAN);
        }),
        (obj.wifiEnabled = function(band) {
          return (
            _.isObject(profile.Config.WiFi) &&
            _.find(profile.Config.WiFi.Radio, function(radio) {
              return radio.OperatingFrequencyBand == band && radio.Enable;
            })
          );
        }),
        (obj.containWiFi = function(band) {
          return (
            _.isObject(profile.Config.WiFi) &&
            _.find(profile.Config.WiFi.Radio, function(radio) {
              return radio.OperatingFrequencyBand == band;
            })
          );
        }),
        (obj.containWiFiClient = function() {
          if (_.isObject(profile.Config.WAN)) {
            var wanConnections = _.chain(profile.Config.WAN)
              .values()
              .pluck('Connection')
              .compact()
              .pluck('1')
              .compact()
              .value();
            if (
              _.find(wanConnections, function(conn) {
                return 'WiFi' == conn.MediaType;
              })
            )
              return !0;
          }
          return (
            obj.isViewFound(/Config.WiFi.Radio.1.EndPoint/) ||
            obj.isViewFound(/Config.WiFi.Radio.2.EndPoint/)
          );
        }),
        (obj.containVLAN = function() {
          return profile && obj.isViewFound(/Config.VLAN/);
        }),
        (obj.containLAN = function() {
          return profile && obj.isViewFound(/Config.LAN/);
        }),
        (obj.containVoIP = function() {
          return profile && _.isObject(profile.Config.VoIP);
        }),
        (obj.containPassword = function() {
          return profile && _.isObject(profile.Config.SystemPassword);
        }),
        (obj.containGrouping = function() {
          return profile && _.isObject(profile.Config.GroupingInterfaces);
        }),
        (obj.defaultPassword = function() {
          return (
            profile &&
            _.isObject(profile.Config.SystemPassword) &&
            'admin' == profile.Config.SystemPassword.Password
          );
        }),
        (obj.isViewFound = function(re) {
          var path = _.find(_.keys(profile.View), function(path) {
            return re.test(path);
          });
          return path && profile.View[path];
        }),
        (obj.byPath = function(path, result) {
          var obj = profile,
            sep = path.split('.');
          for (var i in sep) {
            var token = sep[i];
            if (_.isUndefined(obj) || _.isUndefined(obj[token])) return;
            obj = obj[token];
          }
          return result && result(obj), obj;
        }),
        obj
      );
    });
})();
