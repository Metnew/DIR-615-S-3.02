'use strict';
angular.module('app').controllerProvider.register('VlanFormCtrl', [
  '$scope',
  '$state',
  'translate',
  'snackbars',
  'devinfo',
  '$q',
  'vlanConfig',
  function($scope, $state, translate, snackbars, devinfo, $q, vlanConfig) {
    function inRange(value, range_start, range_end) {
      return value >= range_start && range_end >= value;
    }
    function isInVlan(property, value) {
      return function(vlan) {
        return value === vlan[property];
      };
    }
    function updatePortsU() {
      updatePorts('PortsU', $scope.selected.untagged);
    }
    function updatePortsT() {
      updatePorts('PortsT', $scope.selected.tagged);
    }
    function updatePorts(type, selected) {
      for (var i in $scope.vlan[type]) vlan.cutPort(type, inx, i);
      for (var i in selected) vlan.addPort(type, inx, { Key: selected[i].key });
    }
    function initCallback() {
      function checkIntersectionWith(type) {
        var ports = $scope.selected[type];
        return function(newVal, oldVal) {
          function keyFilter(port) {
            return port.key === key;
          }
          if (!(oldVal.length >= newVal.length)) {
            var key = newVal[newVal.length - 1].key,
              finded = ports.filter(keyFilter)[0],
              index = ports.indexOf(finded);
            ~index && ports.splice([index], 1);
          }
        };
      }
      isEdit()
        ? (($scope.vlan = vlan.cut(inx)),
          ($scope.vid_range_enable = !!$scope.vlan.VidRangeEnd))
        : isAdd() &&
          ($scope.vlan = {
            Enable: !0,
            Name: '',
            PortsT: {},
            PortsU: {},
            Type: 'bridge',
            Vid: '',
            Qos: 0,
          }),
        ($scope.availUntagged = function() {
          var types = {
              bridge: $scope.defined.bridgeAllPorts ? [[], []] : [[], ['wan']],
            },
            type = $scope.vlan.Type,
            args = [$scope.vlan].concat(type in types ? types[type] : []);
          return vlan.getAvailPortsU.apply(null, args);
        }),
        ($scope.availTagged = function() {
          var types = {
              lant: [[], ['wan']],
              want: [['wan'], []],
              bridge: $scope.defined.bridgeAllPorts ? [[], []] : [['wan'], []],
            },
            type = $scope.vlan.Type,
            args = type in types ? types[type] : [];
          return vlan.getAvailPortsT.apply(null, args);
        }),
        ($scope.selected = {
          untagged: vlan.getUsedPortsU($scope.vlan),
          tagged: vlan.getUsedPortsT($scope.vlan),
        }),
        ($scope.initial = {
          vlan: angular.copy($scope.vlan),
          untagged: _.clone($scope.selected.untagged),
          tagged: _.clone($scope.selected.tagged),
        }),
        ($scope.needShow = {
          untagged: function() {
            return (
              !~['want', 'lant'].indexOf($scope.vlan.Type) &&
              !$scope.needShow.vid_range_end()
            );
          },
          tagged: function() {
            return !~['wanu', 'lanu'].indexOf($scope.vlan.Type);
          },
          vid: function() {
            return !~['wanu', 'lanu'].indexOf($scope.vlan.Type);
          },
          vid_range: function() {
            return (
              $scope.needShow.vid &&
              vlanConfig.defined.supportVlanTrunking &&
              !!~['bridge'].indexOf($scope.vlan.Type)
            );
          },
          vid_range_end: function() {
            return $scope.needShow.vid_range() && $scope.vid_range_enable;
          },
          qos: function() {
            return (
              $scope.defined.qosSupport &&
              ~['want', 'bridge'].indexOf($scope.vlan.Type)
            );
          },
        }),
        ($scope.isSavingDisabled = isSavingDisabled),
        prepareAllowedTypes(),
        $scope.$watch('selected.untagged', checkIntersectionWith('tagged'), !0),
        $scope.$watch('selected.tagged', checkIntersectionWith('untagged'), !0),
        $scope.$emit('pageload');
    }
    function fetchManagmentPort() {
      function updateManagementPort(data) {
        var managementPort = data
          ? _.findWhere(data.availPorts, { management: !0 })
          : null;
        $scope.managmentPort = managementPort ? managementPort.name : null;
      }
      var promise = devinfo.once('ports');
      return (
        promise
          .then(updateManagementPort)
          ['finally'](
            devinfo.subscribe.bind(
              devinfo,
              'ports',
              updateManagementPort,
              $scope
            )
          ),
        promise
      );
    }
    function isSavingDisabled() {
      return !isFormChanged();
    }
    function emptyFields() {
      var requiredFields = ['Name'];
      return (
        $scope.needShow.vid() && requiredFields.push('Vid'),
        _.some(requiredFields, function(field) {
          return !$scope.vlan[field];
        })
      );
    }
    function isFormChanged() {
      return (
        !angular.equals($scope.vlan, $scope.initial.vlan) ||
        isPortsChanged('untagged') ||
        isPortsChanged('tagged')
      );
    }
    function isPortsChanged(type) {
      function compareArrays(arr1, arr2) {
        var intersection = _.intersection(
          arr1.map(JSON.stringify),
          arr2.map(JSON.stringify)
        );
        return (
          intersection.length === arr1.length &&
          intersection.length === arr2.length
        );
      }
      return (
        $scope.needShow[type]() &&
        !compareArrays($scope.selected[type], $scope.initial[type])
      );
    }
    function isEdit() {
      return 'edit' === action && null != inx;
    }
    function isAdd() {
      return 'add' === action;
    }
    function portIsManagment(name, port) {
      return $scope.managmentPort == name;
    }
    function getOtherVlans() {
      return _.filter($scope.vlans, function(vlan, key) {
        return /[^\+\-]$/.test(key) && inx !== key;
      });
    }
    function prepareAllowedTypes() {
      ($scope.types = ['bridge', 'want']),
        (isEdit() || !vlan.getTypeCount('wanu') || $scope.defined.multiwan) &&
          $scope.types.push('wanu'),
        (isEdit() || $scope.defined.multilan) && $scope.types.push('lanu'),
        $scope.defined.multilan && $scope.types.push('lant');
    }
    function validatePorts() {
      function validateBridge() {
        var selectedCount =
          $scope.selected.tagged.length + $scope.selected.untagged.length;
        return 'bridge' === $scope.vlan.Type && 2 > selectedCount
          ? (errors.push('vlan_less_than_two_ports'), !1)
          : !0;
      }
      function validateTagged() {
        return $scope.needShow.tagged()
          ? $scope.selected.tagged.length
            ? !0
            : (errors.push('vlan_need_choose_tagged'), !1)
          : !0;
      }
      function validateUntagged() {
        return $scope.needShow.untagged() && 'bridge' !== $scope.vlan.Type
          ? 'wanu' !== $scope.vlan.Type ||
            selectedWanOrWifi($scope.selected.untagged)
            ? $scope.selected.untagged.length
              ? !0
              : (errors.push('vlan_need_choose_untagged'), !1)
            : (errors.push('vlan_need_choose_wan_or_wifi'), !1)
          : !0;
      }
      function validateWanPorts() {
        var wanPortsCount = 0;
        return (
          $scope.selected.tagged &&
            $scope.selected.tagged.length &&
            _.each($scope.selected.tagged, function(elem) {
              elem.item.IsWan && wanPortsCount++;
            }),
          $scope.selected.untagged &&
            $scope.selected.untagged.length &&
            _.each($scope.selected.untagged, function(elem) {
              elem.item.IsWan && wanPortsCount++;
            }),
          wanPortsCount > 1
            ? (errors.push('vlan_need_choose_only_one_wan'), !1)
            : !0
        );
      }
      function selectedWanOrWifi(selected) {
        function isWanOrWifi(port) {
          return port.item.IsWan || port.item.IsWifi;
        }
        return selected.some(isWanOrWifi);
      }
      var errors = [];
      return (
        validateTagged(),
        validateUntagged(),
        validateBridge(),
        validateWanPorts(),
        errors
      );
    }
    var device = $scope.device,
      vlan = device.vlan,
      action = $state.current.name.split('.').pop(),
      inx = $state.params.inx;
    !(function() {
      ($scope.vlanIDmin = vlanConfig.defined.vlanIDMin),
        ($scope.vid_range_enable = !1),
        ($scope.isEdit = isEdit),
        ($scope.isAdd = isAdd),
        $q.all(fetchManagmentPort(), $scope.pull()).then(initCallback),
        ($scope.portIsManagment = portIsManagment);
    })(),
      ($scope.save = function() {
        function finallyPushCb() {
          $state.go('advanced.vlan.list');
        }
        function checkData() {
          var errors = validatePorts();
          return errors && errors.length
            ? (alert(translate(errors[0])), !1)
            : $scope.vlan_form.$invalid || emptyFields()
              ? !1
              : !0;
        }
        var save = isEdit() ? vlan.set.bind(null, inx) : vlan.add;
        checkData() &&
          confirm(translate('vlan_save_answer')) &&
          ((inx = save($scope.vlan)
            .split('.')
            .pop()),
          updatePortsU(),
          updatePortsT(),
          $scope.push()['finally'](finallyPushCb));
      }),
      ($scope.existFreePortsU = function() {
        return Object.keys($scope.availUntagged()).length;
      }),
      ($scope.checkUnique = function(vid, property) {
        return getOtherVlans().some(isInVlan(property, vid))
          ? 'vlan_' + property + '_exists'
          : null;
      }),
      ($scope.checkVlanId = function(vid, property) {
        if ($scope.defined.bcm47xx && (vid - 1) % 16 == 0)
          return 'vlanIDUnavail';
        var vid_start = $scope.vlan.Vid,
          vid_end = $scope.vlan.VidRangeEnd,
          vlans = getOtherVlans();
        if (
          ($scope.defined.sameVlanWanBridge &&
            (vlans = _.filter(vlans, function(o) {
              return $scope.vlan.Type == o.Type;
            })),
          !$scope.vlan[property])
        )
          return null;
        if ('Vid' == property) {
          if (vid_end && vid_start > vid_end)
            return 'vlan_vid_start_more_vid_end';
          if (vid_start == vid_end) return 'vlan_vid_start_equal_vid_end';
          for (var i in vlans) {
            var vlan = vlans[i];
            if (vid_end) {
              if (
                vlan.VidRangeEnd &&
                (inRange(vid_start, vlan.Vid, vlan.VidRangeEnd) ||
                  (vid_start < vlan.Vid && vid_end > vlan.VidRangeEnd))
              )
                return 'vlan_vid_range_overlaps_existing';
              if (inRange(vlan.Vid, vid_start, vid_end))
                return 'vlan_vid_range_overlaps_existing';
            } else {
              if (
                vlan.VidRangeEnd &&
                inRange(vid_start, vlan.Vid, vlan.VidRangeEnd)
              )
                return 'vlan_Vid_exists';
              if (!vlan.VidRangeEnd && vid_start == vlan.Vid)
                return 'vlan_Vid_exists';
            }
          }
        } else if ('VidRangeEnd' == property) {
          if (vid_end && vid_start > vid_end)
            return 'vlan_vid_start_more_vid_end';
          if (vid_start == vid_end) return 'vlan_vid_start_equal_vid_end';
          for (var i in vlans) {
            var vlan = vlans[i];
            if (vid_start) {
              if (
                vlan.VidRangeEnd &&
                (inRange(vid_end, vlan.Vid, vlan.VidRangeEnd) ||
                  (vid_start < vlan.Vid && vid_end > vlan.VidRangeEnd))
              )
                return 'vlan_vid_range_overlaps_existing';
              if (inRange(vlan.Vid, vid_start, vid_end))
                return 'vlan_vid_range_overlaps_existing';
            } else {
              if (
                vlan.VidRangeEnd &&
                inRange(vid_end, vlan.Vid, vlan.VidRangeEnd)
              )
                return 'vlan_Vid_exists';
              if (!vlan.VidRangeEnd && vid_end == vlan.Vid)
                return 'vlan_Vid_exists';
            }
          }
        }
        return null;
      }),
      ($scope.needHWReboot = function(vid) {
        return (vid - 2) % 16 == 0;
      }),
      ($scope.checkEnable = function(isEnabled) {
        var needQuestion = !isEnabled && 'lanu' === $scope.vlan.Type,
          confirmText = translate('vlan_lanu_disable_answer');
        needQuestion && !confirm(confirmText) && ($scope.vlan.Enable = !0);
      }),
      ($scope.needShowChechbox = function() {
        return _.isUndefined($scope.vlan) || 'lanu' === $scope.vlan.Type
          ? !1
          : !0;
      }),
      ($scope.checkVidRangeEnable = function(enable) {
        enable
          ? $scope.selected && (($scope.selected.untagged = []), updatePortsU())
          : ($scope.vlan.VidRangeEnd = null);
      });
  },
]);
