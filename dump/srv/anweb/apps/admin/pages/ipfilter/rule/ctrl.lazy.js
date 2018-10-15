'use strict';
!(function() {
  function IPFilterRuleCtrl(
    $scope,
    $rootScope,
    $state,
    devinfo,
    translate,
    history,
    constants,
    util
  ) {
    function activate() {
      function pullClient() {
        function success(result) {
          (ipfilter.client = result.client),
            prepare(),
            ($scope.ipfilter.loading = !1);
        }
        (helper = util.makeHelper()),
          devinfo.once('client').then(success, __pullError);
      }
      function prepare() {
        _.isUndefined(__index)
          ? ((ipfilter.rule = helper.getDefaultTemplate()),
            isSupported('id') && (ipfilter.rule.id = helper.getBiggestID()),
            (ipfilter.action = 'add'))
          : ((ipfilter.rule = helper.getRule(__index)),
            (ipfilter.action = 'edit')),
          (ipfilter.manualSrcPort = !!ipfilter.rule.ports),
          (ipfilter.ipversion =
            isSupported('is_ipv6') && ipfilter.rule.is_ipv6 ? 'ipv6' : 'ipv4'),
          prepareIP('source'),
          prepareIP('destination'),
          (ipfilter.isActivate = !0),
          (__backupRule = angular.copy(ipfilter.rule)),
          $scope.$emit('pageload');
      }
      function prepareIP(direction) {
        var ip = 'source' == direction ? ipfilter.rule.ips : ipfilter.rule.ipd,
          arrIp = ip ? ip.split('-') : [];
        (ipfilter.ip[direction].begin = arrIp[0] || ''),
          (ipfilter.ip[direction].end = arrIp[1] || '');
      }
      return (
        ($scope.ipfilter.loading = !0),
        util.wasActivate()
          ? void pullClient()
          : void util
              .pull()
              .then(pullClient)
              ['catch'](__pullError)
      );
    }
    function apply() {
      function success() {
        $state.go(currentState + '.info'),
          $scope.overlay.circular.stop(overlayId);
      }
      function error(response) {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      if ($scope.form.$valid) {
        var confilct = helper.conflicts(ipfilter.rule, __index);
        if (confilct) return void alert(translate('ipfilterConflictRule'));
        var isLocalRule = helper.isLocalRule(ipfilter.rule);
        if (!isLocalRule || confirm(translate('ipfilterIsLocalRule'))) {
          if (!_.isUndefined(ipfilter.client)) {
            var accessLost = helper.accessWillLost(
              ipfilter.rule,
              ipfilter.client
            );
            if (accessLost && !confirm(translate('ipfilterAccessLostRule')))
              return;
          }
          var overlayId = $scope.overlay.circular.start();
          util
            .applyRule(ipfilter.rule, __index)
            .then(success)
            ['catch'](error);
        }
      }
    }
    function remove() {
      function success() {
        history.setCleanLastHistory(!0), $state.go(currentState + '.info');
      }
      function error(response) {
        $state.go('error', { code: 'removeError', message: 'removeErrorDesc' });
      }
      if (confirm(translate('ipfilterRemoveRuleWarningAnswer'))) {
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start();
        $rootScope.$emit('unsavedStop', !0);
        var removeList = helper.makeRemoveList([__index]);
        util
          .removeRules(removeList)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
    }
    function isSupported(param) {
      return helper ? helper.isSupported(param) : void 0;
    }
    function isRequired(param) {
      return helper ? helper.isRequired(param) : void 0;
    }
    function isDisabled(param) {
      function portDisabled() {
        return 3 == rule.proto || 4 == rule.proto;
      }
      var rule = ipfilter.rule;
      if (!rule) return !1;
      switch (param) {
        case 'ports':
        case 'portd':
          return portDisabled();
        case 'source_port':
          return portDisabled() || !ipfilter.manualSrcPort;
      }
    }
    function getIPVersionList() {
      return [{ name: 'IPv4', value: 'ipv4' }, { name: 'IPv6', value: 'ipv6' }];
    }
    function getActionList() {
      return helper.getActions();
    }
    function getProtocolList() {
      return helper.getProtocols();
    }
    function validation(value, param) {
      return ipfilter.rule ? helper.validation(ipfilter.rule, param) : null;
    }
    function wasModified() {
      return !_.isEqual(ipfilter.rule, __backupRule);
    }
    function __pullError() {
      $state.go('error', { code: 'removeError', message: 'removeErrorDesc' });
    }
    function changeIP(obj, direction) {
      if (ipfilter.rule) {
        var result = [];
        obj.begin && result.push(obj.begin), obj.end && result.push(obj.end);
        var value = result.join('-');
        'source' == direction
          ? (ipfilter.rule.ips = value)
          : (ipfilter.rule.ipd = value);
      }
    }
    function changeIPVersion(version) {
      ipfilter.rule.is_ipv6 = 'ipv6' == version;
    }
    function onAutoSrcPortChange() {
      ipfilter.manualSrcPort || (ipfilter.rule.ports = '');
    }
    function getNoteExampleIp() {
      return constants.DENY_IP_RANGE
        ? isSupported('is_ipv6')
          ? 'ipfilter_ip_note_not_range'
          : 'ipfilter_ip_note_ipv4_only_not_range'
        : isSupported('is_ipv6')
          ? 'ipfilter_ip_note'
          : 'ipfilter_ip_note_ipv4_only';
    }
    ($scope.constants = constants),
      ($scope.ipfilter = {
        isActivate: !1,
        action: null,
        rule: null,
        ipversion: null,
        client: null,
        ip: { source: {}, destination: {} },
        apply: apply,
        remove: remove,
        isSupported: isSupported,
        isRequired: isRequired,
        isDisabled: isDisabled,
        getIPVersionList: getIPVersionList,
        getActionList: getActionList,
        getProtocolList: getProtocolList,
        validation: validation,
        changeIPVersion: changeIPVersion,
        wasModified: wasModified,
        onAutoSrcPortChange: onAutoSrcPortChange,
        getNoteExampleIp: getNoteExampleIp,
      });
    var helper,
      ipfilter = $scope.ipfilter,
      __index = _.isUndefined($state.params.inx)
        ? void 0
        : parseInt($state.params.inx),
      __backupRule = null;
    activate(),
      $scope.$watchCollection('ipfilter.ip.source', function(value) {
        changeIP(value, 'source');
      }),
      $scope.$watchCollection('ipfilter.ip.destination', function(value) {
        changeIP(value, 'destination');
      });
    var currentState = $state.current.name.split('.');
    currentState.pop(), (currentState = currentState.join('.'));
  }
  angular
    .module('app')
    .controllerProvider.register('IPFilterRuleCtrl', [
      '$scope',
      '$rootScope',
      '$state',
      'devinfo',
      'translate',
      'history',
      'ipfilterConstants',
      'ipfilterUtil',
      IPFilterRuleCtrl,
    ]);
})();
