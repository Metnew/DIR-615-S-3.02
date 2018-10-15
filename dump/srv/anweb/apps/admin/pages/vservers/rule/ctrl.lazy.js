'use strict';
!(function() {
  function VserversRuleCtrl(
    $scope,
    $rootScope,
    $state,
    translate,
    history,
    funcs,
    util,
    template
  ) {
    function activate(overlayId) {
      function success() {
        (helper = util.makeHelper()),
          (vservers.config = util.getConfig()),
          (vservers.attrs = util.getAttrs()),
          _.isUndefined(__index)
            ? ((vservers.rule = helper.getDefaultRule(vservers.attrs)),
              (vservers.action = 'add'))
            : ((vservers.rule = _.find(vservers.config.Rules, function(r) {
                return r.__id == __index;
              })),
              (vservers.action = 'edit')),
          (__backupRule = angular.copy(vservers.rule));
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      function finallyCb() {
        overlayId && overlay.stop(overlayId),
          $scope.$emit('pageload'),
          (vservers.isActivate = !0);
      }
      util
        .pull()
        .then(success)
        ['catch'](error)
        ['finally'](finallyCb);
    }
    function addSourceIp() {
      vservers.rule.Source.IP.push(''), (vservers.sourceIpfocus = !0);
    }
    function removeSourceIp(ip, inx) {
      vservers.rule.Source.IP.splice(inx, 1);
    }
    function getTypesList() {
      return _.map(template, function(elem) {
        return { name: elem.Name, value: elem.Type };
      });
    }
    function getInterfaceList() {
      var output = [];
      return vservers.config
        ? (output.push({ Name: 'allInterfaces', Value: 'all' }),
          (output = output.concat(vservers.config.Ifaces)))
        : output;
    }
    function getProtocolList() {
      function getPosProtocols() {
        var type = vservers.rule.Type || 'custom',
          templ = _.find(template, function(e) {
            return e.Type == type;
          });
        return templ && templ.ProtocolList
          ? templ.ProtocolList
          : ['TCP', 'UDP', 'TCP/UDP'];
      }
      if (!vservers.config) return [];
      var allProtocols = vservers.attrs.Proto['enum'],
        posProtocols = getPosProtocols();
      return helper.getProtocolList(allProtocols, posProtocols);
    }
    function isSupported(param) {
      return util.isSupported(param);
    }
    function validation(newValue, param) {
      var rule = vservers.rule;
      if (!rule) return null;
      var errors = helper.validation(rule, __index, vservers.config)[param];
      return errors.length ? errors[0] : null;
    }
    function wasModified() {
      return !_.isEqual(vservers.rule, __backupRule);
    }
    function apply() {
      function success() {
        $state.go(currentState + '.info');
      }
      function error() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      function finallyCb() {
        overlayId && overlay.stop(overlayId);
      }
      if ($scope.form.$valid) {
        var overlayId = overlay.start();
        util
          .applyRule(vservers.rule, __index)
          .then(success)
          ['catch'](error)
          ['finally'](finallyCb);
      }
    }
    function remove() {
      function success() {
        history.setCleanLastHistory(!0), $state.go(currentState + '.info');
      }
      function error() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      function finallyCb() {
        overlayId && overlay.stop(overlayId);
      }
      if (confirm(translate('vserversRemoveRuleWarningAnswer'))) {
        var overlayId = overlay.start();
        $rootScope.$emit('unsavedStop', !0),
          util
            .removeRules([vservers.rule.__id])
            .then(success)
            ['catch'](error)
            ['finally'](finallyCb);
      }
    }
    function isDisabled(param) {
      var rule = vservers.rule;
      if (!rule) return !1;
      switch (param) {
        case 'Source.Iface':
          return rule.SNAT;
        case 'Source.Ports':
        case 'Dest.Ports':
          var type = rule.Type;
          if ('sftp' == type || 'pcanywhere' == type) return !0;
      }
      return !1;
    }
    function changeType(type) {
      var input = _.find(template, function(e) {
        return e.Type == type;
      });
      input &&
        (_.extend(vservers.rule.Source.Ports, input.Source.Ports),
        _.extend(vservers.rule.Dest.Ports, input.Dest.Ports),
        _.contains(input.ProtocolList, vservers.rule.Proto) ||
          (vservers.rule.Proto = input.ProtocolList[0]));
    }
    function changeParam(param, value) {
      if (!vservers.rule) return null;
      switch (param) {
        case 'SNAT':
          value && (vservers.rule.Source.Iface = 'all');
      }
    }
    function showUseSourcePorts() {
      return _.chain(vservers.useSourcePorts)
        .sortBy(function(elem) {
          return parseInt(elem.startPort);
        })
        .map(function(elem) {
          return elem.startPort && elem.endPort
            ? elem.startPort + ' - ' + elem.endPort
            : elem.startPort
              ? elem.startPort
              : elem.endPort
                ? elem.endPort
                : void 0;
        })
        .uniq()
        .join(', ');
    }
    function __updateUseSourcePorts(newValues) {
      var rule = vservers.rule;
      if (rule) {
        var curIndex = _.isUndefined(__index) ? void 0 : __index.toString();
        vservers.useSourcePorts = helper.getUseSourcePorts(
          vservers.config.UsedSourcePorts,
          rule.Source.Iface,
          rule.Proto,
          curIndex
        );
      }
    }
    $scope.vservers = {
      isActivate: !1,
      action: null,
      rule: null,
      useSourcePorts: null,
      apply: apply,
      remove: remove,
      addSourceIp: addSourceIp,
      removeSourceIp: removeSourceIp,
      validation: validation,
      isSupported: isSupported,
      isDisabled: isDisabled,
      changeType: changeType,
      changeParam: changeParam,
      getTypesList: getTypesList,
      getInterfaceList: getInterfaceList,
      getProtocolList: getProtocolList,
      wasModified: wasModified,
      showUseSourcePorts: showUseSourcePorts,
    };
    var helper,
      vservers = $scope.vservers,
      overlay = $scope.overlay.circular,
      __index = _.isUndefined($state.params.inx)
        ? void 0
        : parseInt($state.params.inx),
      __backupRule = null,
      currentState = $state.current.name.split('.');
    currentState.pop(),
      (currentState = currentState.join('.')),
      activate(),
      $scope.$watch('vservers.rule.Source.Iface', __updateUseSourcePorts),
      $scope.$watch('vservers.rule.Proto', __updateUseSourcePorts);
  }
  angular
    .module('app')
    .controllerProvider.register('VserversRuleCtrl', [
      '$scope',
      '$rootScope',
      '$state',
      'translate',
      'history',
      'funcs',
      'vserversUtil',
      'vserversTemplate',
      VserversRuleCtrl,
    ]);
})();
