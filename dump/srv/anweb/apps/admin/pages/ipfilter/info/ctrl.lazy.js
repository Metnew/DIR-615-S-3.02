'use strict';
!(function() {
  function IPFilterInfoCtrl($scope, $state, translate, util) {
    function activate() {
      function success() {
        (helper = util.makeHelper()),
          (ipfilter.isActivate = !0),
          (ipfilter.rules = helper.getRules()),
          $scope.$emit('pageload');
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      function stopOverlay() {
        overlayId &&
          ($scope.overlay.circular.stop(overlayId), (overlayId = null));
      }
      util
        .pull()
        .then(success)
        ['catch'](error)
        ['finally'](stopOverlay);
    }
    function add() {
      $state.go(currentState + '.add');
    }
    function edit(item) {
      $state.go(currentState + '.edit', { inx: item.__index });
    }
    function remove(items) {
      function error() {
        $state.go('error', { code: 'removeError', message: 'removeErrorDesc' });
      }
      if (confirm(translate('ipfilterRemoveRulesWarningAnswer'))) {
        overlayId = $scope.overlay.circular.start();
        var indexes = _.pluck(items, '__index'),
          removeList = helper.makeRemoveList(indexes);
        util
          .removeRules(removeList)
          .then(activate)
          ['catch'](error);
      }
    }
    function getSource(item) {
      return getRange(item, 'ips', 'ports');
    }
    function getDestination(item) {
      return getRange(item, 'ipd', 'portd');
    }
    function generateSourceDestName() {
      var caption =
        '[' +
        translate('sourseIPAddr') +
        ']:[' +
        translate('port') +
        '] - [' +
        translate('destIPAddr') +
        ']:[' +
        translate('port') +
        ']';
      return caption;
    }
    function getSourceDestination(item) {
      function formIPv6SourceDestination(item) {
        function getIpv6Str(ipv6, param) {
          if (ipv6) {
            var result = '';
            result += '<span>[</span>';
            var arrIPv6 = ipv6.split('-');
            return (
              'source' == param &&
                (($scope.ipsource = arrIPv6),
                (result += "<span ipv6cut='ipsource[0]'></span>"),
                $scope.ipsource[1] &&
                  ((result += '<span> - </span>'),
                  (result += "<span ipv6cut='ipsource[1]'></span>"))),
              'dest' == param &&
                (($scope.ipdest = arrIPv6),
                (result += "<span ipv6cut='ipdest[0]'></span>"),
                $scope.ipdest[1] &&
                  ((result += '<span> - </span>'),
                  (result += "<span ipv6cut='ipdest[1]'></span>"))),
              (result += '<span>]</span>')
            );
          }
        }
        var ipsstr =
            item.ips && '' != item.ips && '0.0.0.0/0' != item.ips
              ? getIpv6Str(item.ips, 'source')
              : '<span>[' + escapeHtml(translate('allIPAddress')) + ']</span>',
          ports = item.ports || escapeHtml(translate('allPorts')),
          ipdstr =
            item.ipd && '' != item.ipd && '0.0.0.0/0' != item.ipd
              ? getIpv6Str(item.ipd, 'dest')
              : '<span>[' + escapeHtml(translate('allIPAddress')) + ']</span>',
          portd = item.portd || escapeHtml(translate('allPorts')),
          resultStr = '';
        return (
          (resultStr =
            resultStr +
            "<div class='not_break_block'>" +
            ipsstr +
            ' : [' +
            ports +
            ']</div>'),
          (resultStr += '<div> - </div>'),
          (resultStr =
            resultStr +
            "<div class='not_break_block'>" +
            ipdstr +
            ' : [' +
            portd +
            ']</div>')
        );
      }
      return item.is_ipv6
        ? formIPv6SourceDestination(item)
        : getRange(item, 'ips', 'ports') +
            ' - ' +
            getRange(item, 'ipd', 'portd');
    }
    function getRange(item, ipField, portField) {
      var ip =
          '' != item[ipField] && '0.0.0.0/0' != item[ipField]
            ? item[ipField]
            : escapeHtml(translate('allIPAddress')),
        port = item[portField] || escapeHtml(translate('allPorts')),
        arrIp = ip.split('-'),
        strIp = arrIp.join(' - ');
      return (
        "<div class='not_break_block'><span>[" +
        strIp +
        '</span><span>]</span><span> : </span><span>[' +
        port +
        ']</span></div>'
      );
    }
    function getMiniCaption(item) {
      return _.has(item, 'name')
        ? item.name
        : _.has(item, 'id')
          ? translate('rule') + ' №' + item.id
          : void 0;
    }
    function escapeHtml(str) {
      var escapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
      };
      if (_.isString(str))
        return str.replace(/<|>/g, function(s) {
          return escapes[s];
        });
    }
    function getMiniInfo(item) {
      var info = [];
      return (
        info.push(item.IPVersion + ', '),
        info.push(translate(item.proto)),
        info.join('')
      );
    }
    function isSupported(param) {
      return helper ? helper.isSupported(param) : void 0;
    }
    function isEmptyRules() {
      return !ipfilter.rules || 0 == ipfilter.rules.length;
    }
    $scope.ipfilter = {
      isActivate: !1,
      rules: null,
      add: add,
      edit: edit,
      remove: remove,
      getSource: getSource,
      getDestination: getDestination,
      generateSourceDestName: generateSourceDestName,
      getSourceDestination: getSourceDestination,
      getMiniCaption: getMiniCaption,
      getMiniInfo: getMiniInfo,
      isSupported: isSupported,
      isEmptyRules: isEmptyRules,
    };
    var helper,
      overlayId = null,
      ipfilter = $scope.ipfilter;
    activate();
    var currentState = $state.current.name.split('.');
    currentState.pop(), (currentState = currentState.join('.'));
  }
  angular
    .module('app')
    .controllerProvider.register('IPFilterInfoCtrl', [
      '$scope',
      '$state',
      'translate',
      'ipfilterUtil',
      IPFilterInfoCtrl,
    ]);
})();
