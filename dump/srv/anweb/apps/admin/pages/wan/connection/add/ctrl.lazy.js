'use strict';
function WanAddCtrl($scope, $state, $stateParams, $q, $timeout, translate) {
  function activate() {
    pageLoadStart(),
      core.fetch().then(function() {
        core.mode.isAdvancedMode() || cleanConnections(),
          makeContype(),
          makeInterface($scope.wan.model.contype),
          makeConnection(),
          makeConnectionMedia(),
          changeState(),
          setBackup();
      });
  }
  function apply() {
    function isValid() {
      return $scope.form.$valid;
    }
    function conflictMsg() {
      return confirm(translate('overwritingWanConnectionWarningAnswer'));
    }
    var ifacetype = $scope.wan.model['interface']
        ? $scope.wan.model['interface'].type
        : null,
      contype = $scope.wan.model.contype;
    if (!ifacetype && 'pptp' != contype && 'l2tp' != contype)
      return void confirm(translate('noInterfacesAvailable'));
    var connection = {
      contype: contype,
      type: helper.connection.identifyType(contype),
      data: $scope.wan.model.connection,
    };
    return (
      $scope.$emit('resetErrorForm', !0),
      isValid()
        ? $scope.additional.isNeed(contype, ifacetype)
          ? void $scope.additional
              .getAdditionalMode(contype)
              .then(function(result) {
                $scope.connections.add(connection);
                var mode = result.mode;
                if ('none' == mode || 'auto' == mode || 'select' == mode) {
                  if (
                    ('select' == mode &&
                      $scope.connections.add(result.connection),
                    $scope.connections.prepare(),
                    $scope.connections.isConflict() && !conflictMsg())
                  )
                    return void $scope.connections.reject();
                  $scope.connections.apply();
                }
                'new' == mode &&
                  (($scope.wan.isAdditional = !0),
                  makeContype({ type: connection.type }));
              })
          : ($scope.connections.add(connection),
            $scope.connections.prepare(),
            $scope.connections.isConflict() && !conflictMsg()
              ? void $scope.connections.reject()
              : void $scope.connections.apply())
        : void 0
    );
  }
  function back() {
    var connection = $scope.connections.reject()[0];
    ($scope.wan.isAdditional = !1),
      makeContype(),
      ($scope.wan.model.contype = angular.copy(connection.contype)),
      $timeout(function() {
        $scope.wan.model.connection = _.extend(
          $scope.wan.model.connection,
          connection.data
        );
      });
  }
  function makeInterface(contype) {
    function clean() {
      ($scope.wan.interfaces.length = 0),
        ($scope.wan.model['interface'] = null);
    }
    function setList() {
      var types = getMediaTypes(contype);
      _.each(types, function(type) {
        var ifaces = helper.media.buildInterfaces(type, contype);
        $scope.wan.interfaces = $scope.wan.interfaces.concat(ifaces);
      });
    }
    function setValue() {
      var list = $scope.wan.interfaces;
      if (list.length) {
        var selected_index = list.findIndex(function(element) {
          return 'addNewPVC' == element.info;
        });
        $scope.wan.model['interface'] =
          -1 != selected_index ? list[selected_index] : list[0];
      } else $scope.wan.model['interface'] = null;
    }
    clean(), setList(), setValue();
  }
  function makeContype(additional) {
    function clean() {
      ($scope.wan.contypes.length = 0), ($scope.wan.model.contype = null);
    }
    function setList() {
      if (additional) var types = getAdditionalSubTypes(additional.type);
      else var types = getConnectionTypes();
      $scope.wan.contypes = _.map(types, function(type) {
        return { name: type, value: type };
      });
    }
    function setValue() {
      var list = $scope.wan.contypes;
      $scope.wan.model.contype = list.length ? list[0].value : null;
    }
    clean(), setList(), setValue();
  }
  function makeConnection() {
    function generateConnection(contype) {
      var connection = helper.connection.getTemplate(contype);
      return (
        (connection.Enable = !0),
        (connection.Name = helper.connection.generateConnectionName(contype)),
        connection
      );
    }
    var contype = $scope.wan.model.contype;
    delete $scope.wan.model.connection.Flags,
      _.extend($scope.wan.model.connection, generateConnection(contype));
  }
  function makeConnectionMedia() {
    function cleanConnectionMedia() {
      delete $scope.wan.model.connection.Media,
        delete $scope.wan.model.connection.MediaType,
        $scope.$broadcast('wan.model.connection.media.clean');
    }
    function setConnectionMedia(iface, contype) {
      var mediaType = iface.type,
        mediaObj = getMediaInterface(iface.type, iface.instance, contype);
      ($scope.wan.model.connection.MediaType = mediaType),
        ($scope.wan.model.connection.Media = funcs.setValue(
          mediaType,
          angular.copy(mediaObj),
          {}
        )),
        $scope.$broadcast('wan.model.connection.media.set', mediaType);
    }
    var contype = $scope.wan.model.contype,
      iface = $scope.wan.model['interface'];
    _.isNull(iface)
      ? cleanConnectionMedia()
      : setConnectionMedia(iface, contype);
  }
  function changeState(options) {
    var contype = $scope.wan.model.contype,
      stateInfo = helper.connection.getStateInfo(contype),
      currentState = $state.current.name.split('.');
    currentState.pop(),
      'add' == currentState[currentState.length - 1] && currentState.pop(),
      (currentState = currentState.join('.'));
    var path = currentState + '.add' + stateInfo.path,
      params = { type: stateInfo.type, actualType: stateInfo.actualType },
      options = options || {};
    $state.go(path, params, options);
  }
  function cleanConnections() {
    _.each(device.wan.flattenConnections(), function(item) {
      device.wan[item.type].cut(item.instance);
    });
  }
  function setBackup() {
    $timeout(function() {
      $scope.wan.backup.set($scope.wan.model.connection);
    });
  }
  function pageLoadStart() {
    $scope.wan.backup.clean(), ($scope.wan.isActivate = !1);
  }
  function pageLoadEnd() {
    $scope.wan.isActivate ||
      (($scope.wan.isActivate = !0), $scope.$emit('pageload'));
  }
  function setMode($event, mode) {
    $scope.wan.mode = mode;
  }
  function getMediaTypes(contype) {
    var support = helper.media.getMediaTypesByContype(contype),
      used = helper.media.identifyUseTypes();
    return _.intersection(used, support);
  }
  function getMediaInterface(type, instance, contype) {
    if ($scope.wan.isAdditional && 'DSL.ATM' != type) {
      var basicConnection = $scope.connections.getBasicConnection();
      if (basicConnection.MediaType == type)
        return angular.copy(
          funcs.fetchBranch(basicConnection.Media, type + '.')
        );
    }
    return helper.media.getInterface(type, instance, contype);
  }
  function getConnectionTypes() {
    return supported.connections();
  }
  function getAdditionalSubTypes(type) {
    return helper.connection.getAdditionalSubTypes(type);
  }
  var device = $scope.device,
    $state = $scope.__args.$state,
    $q = ($scope.__args.$stateParams, $scope.__args.$q),
    $timeout = $scope.__args.$timeout,
    ngDialog = $scope.__args.ngDialog,
    translate = $scope.__args.translate,
    helper = $scope.__args.wanHelper,
    wan = device.wan,
    funcs = device.funcs,
    supported = wan.supported(),
    core = $scope.wanCore;
  ($scope.wan = {
    model: { connection: {}, interface: null, contype: null },
    interfaces: [],
    contypes: [],
    activate: activate,
    apply: apply,
    back: back,
    makeConnection: makeConnection,
    makeConnectionMedia: makeConnectionMedia,
  }),
    ($scope.wan.isActivate = !1),
    ($scope.wan.isAdditional = !1),
    ($scope.wan.backup = core.connection.makeBackup()),
    ($scope.wan.action = core.connection.identifyAction()),
    $scope.$on('wan.header.state', setMode),
    $scope.$on('wan.header.change', setMode),
    $scope.$on('$stateChangeSuccess', pageLoadEnd),
    activate(),
    $scope.$watch('wan.model.interface', function(iface, oldInterface) {
      _.isUndefined(iface) ||
        _.isEqual(iface, oldInterface) ||
        makeConnectionMedia();
    }),
    $scope.$watch('wan.model.contype', function(contype, oldContype) {
      _.isUndefined(contype) ||
        _.isNull(oldContype) ||
        _.isEqual(contype, oldContype) ||
        (makeInterface($scope.wan.model.contype),
        makeConnection(),
        makeConnectionMedia(),
        changeState(),
        setBackup());
    }),
    ($scope.connections = (function() {
      function getBasicConnection() {
        return list.length ? angular.copy(list[0].data) : null;
      }
      function add(con) {
        list.push(angular.copy(con));
      }
      function reject() {
        return list.splice(-1, 1);
      }
      function isConflict() {
        return _.some(list, function(elem) {
          return wan.conflictsConnections(
            elem.data,
            elem.type,
            elem.instance
          ).length;
        });
      }
      function prepare() {
        1 == list.length &&
          'pptp' == list[0].type &&
          (list[0].data.AutomaticalConnection = !0),
          2 == list.length &&
            'pptp' == list[0].type &&
            ((list[0].data.__Layer = '4'),
            (list[0].data.__LowerLayer = list[1].data.__Key || 'create'),
            list[1].data.__Link &&
              (list[0].data.__LowerConnection = list[1].data.__Link));
      }
      function apply() {
        updateNotConflictsConnections(), cutConflictsConnections();
        for (var i = list.length - 1; i >= 0; i--) {
          var con = list[i];
          con.instance
            ? (wan[con.type].cut(con.instance),
              wan[con.type].set(con.data, con.instance))
            : (con.instance = wan[con.type].add(con.data));
        }
        con.data.Flags &&
          con.data.Flags.MLD &&
          device.wan.setMLDInstance(con.instance),
          setLinksBetweenConnections();
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start();
        $scope.wanCore
          .save()
          .then(function() {
            var currentState = $state.current.name.split('.');
            currentState.pop(),
              'add' == currentState[currentState.length - 1] &&
                (currentState.pop(), currentState.pop()),
              (currentState = currentState.join('.')),
              $state.go(currentState + '.info');
          })
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
      function updateNotConflictsConnections() {
        function needSetMediaCreate(removeRules, currentMediaRules) {
          return (
            removeRules.length > 0 &&
            removeRules.length == currentMediaRules.length
          );
        }
        _.each(list, function(con) {
          if ('DSL.ATM' == con.data.MediaType) {
            var removeRules = wan.conflictsConnections(
                con.data,
                con.type,
                con.instance
              ),
              currentMediaRules = wan.getConnectionsByMedia(con.data);
            needSetMediaCreate(removeRules, currentMediaRules) &&
              funcs.setValue(
                'Media.' + con.data.MediaType + '.__Key',
                'create',
                con.data
              );
          }
        });
      }
      function cutConflictsConnections() {
        _.each(list, function(con) {
          if (!con.instance) {
            var removeRules = wan.conflictsConnections(
              con.data,
              con.type,
              con.instance
            );
            _.each(removeRules, function(rule) {
              wan[rule.type].cut(rule.instance);
            });
          }
        });
      }
      function setLinksBetweenConnections() {
        if (2 == list.length && 'pptp' == list[0].type) {
          var actualType = helper.connection.getDataModelName(list[1].type);
          (list[0].data.__LowerConnectionNative =
            'Device.WAN.' + actualType + '.Connection.' + list[1].instance),
            wan[list[0].type].set(list[0].data, list[0].instance);
        }
      }
      var list = [];
      return {
        getBasicConnection: getBasicConnection,
        add: add,
        reject: reject,
        isConflict: isConflict,
        prepare: prepare,
        apply: apply,
      };
    })()),
    ($scope.additional = (function() {
      function isNeed(contype, ifacetype) {
        return helper.connection.isAdditionalType(contype, ifacetype);
      }
      function getAdditionalMode(contype) {
        switch (contype) {
          case 'pppoe':
            return getModeDialogPPPoE();
          case 'pptp':
          case 'l2tp':
            return getModeDialogPPTP();
        }
      }
      function getModeDialogPPPoE() {
        function openDialog(modes, connections, contype) {
          return ngDialog.open({
            template: 'dialogs/wan_additional_connection/pppoe/dialog.tpl.html',
            controller: 'WanAdditionalConnectionPPPoEDialogCtrl',
            scope: $scope,
            data: { connections: connections },
          });
        }
        var types = helper.connection.getAdditionalTypes('pppoe'),
          connections = wan.flattenConnections(types, !0);
        return openDialog(null, connections, null).closePromise.then(
          closePromiseCb
        );
      }
      function getModeDialogPPTP() {
        function openDialog(connections) {
          return ngDialog.open({
            template: 'dialogs/wan_additional_connection/pptp/dialog.tpl.html',
            controller: 'WanAdditionalConnectionPPTPDialogCtrl',
            scope: $scope,
            data: {
              useAuto: wan.useAutomaticalPPTP(),
              connections: connections,
            },
          });
        }
        var types = helper.connection.getAdditionalTypes('pptp'),
          connections = wan.flattenConnections(types, !0);
        return openDialog(connections).closePromise.then(closePromiseCb);
      }
      function closePromiseCb(result) {
        return _.isNull(result.value) || !_.isObject(result.value)
          ? $q.reject()
          : result.value;
      }
      return { isNeed: isNeed, getAdditionalMode: getAdditionalMode };
    })());
}
