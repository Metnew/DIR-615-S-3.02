'use strict';
!(function() {
  function VserversInfoCtrl($scope, $state, translate, util) {
    function activate(overlayId) {
      function success() {
        (helper = util.makeHelper()),
          (vservers.config = util.getConfig()),
          (vservers.intefracesEmpty = helper.getEmptyIfaces(
            vservers.config.Rules
          ));
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
    function add() {
      $state.go(currentState + '.add');
    }
    function edit(item) {
      $state.go(currentState + '.edit', { inx: item.__id });
    }
    function remove(items) {
      function success() {
        activate();
      }
      function error() {
        $state.go('error', { code: 'removeError', message: 'removeErrorDesc' });
      }
      function finallyCb() {
        overlay.stop(overlayId);
      }
      if (confirm(translate('vserversRemoveRulesWarningAnswer'))) {
        var overlayId = overlay.start(),
          indexes = _.pluck(items, '__id');
        util
          .removeRules(indexes)
          .then(success)
          ['catch'](error)
          ['finally'](finallyCb);
      }
    }
    function isEmptyRules() {
      return (
        !vservers.config ||
        !vservers.config.Rules ||
        0 == vservers.config.Rules.length
      );
    }
    function isSupported(param) {
      return util.isSupported(param);
    }
    function getIP(ips) {
      return ips.length && '' != ips[0] ? ips[0] : translate('allIPAddress');
    }
    function getIfaceName(iface) {
      if ('all' == iface) return translate('allIPAddress');
      var result = _.find(vservers.config.Ifaces, function(e) {
        return e.Value == iface;
      });
      return result ? result.Name : '';
    }
    function getMiniInfo(item) {
      var info = [],
        iface = translate(item.Source.Iface)
          .replace(/\</g, '&lt;')
          .replace(/\>/g, '&gt;');
      return (
        info.push(translate('vserversInterface') + ': ' + iface),
        info.push(translate('vserversProtocol') + ': ' + item.Proto),
        info.push(
          translate('vserversSource') +
            ': ' +
            item.Source.IP +
            ':' +
            item.Source.Ports[1].Start +
            ':' +
            item.Source.Ports[1].End
        ),
        info.push(
          translate('vserversDestination') +
            ': ' +
            item.Dest.IP +
            ':' +
            item.Dest.Ports[1].Start +
            ':' +
            item.Dest.Ports[1].End
        ),
        isSupported('SNAT') &&
          info.push(
            translate('vserversNATLoopback') +
              ': ' +
              getNATLoopbackStatus(item.SNAT)
          ),
        info.join('<br>')
      );
    }
    function joinPorts(input) {
      var ports = [];
      return (
        _.each(input, function(elem) {
          var str = '';
          elem.Start && (str += elem.Start),
            elem.End && (str += ':' + elem.End),
            ports.push(str);
        }),
        ports.join(',')
      );
    }
    function getNATLoopbackStatus(snat) {
      return snat
        ? "<span class='status_enable'>" +
            translate('vserversNATLoopbackStatusEnabled') +
            '</span>'
        : "<span class='status_disable'>" +
            translate('vserversNATLoopbackStatusDisabled') +
            '</span>';
    }
    $scope.vservers = {
      isActivate: !1,
      config: null,
      intefracesEmpty: null,
      activate: activate,
      add: add,
      edit: edit,
      remove: remove,
      isEmptyRules: isEmptyRules,
      isSupported: isSupported,
      getIP: getIP,
      getIfaceName: getIfaceName,
      getMiniInfo: getMiniInfo,
      joinPorts: joinPorts,
      getNATLoopbackStatus: getNATLoopbackStatus,
    };
    var helper,
      vservers = $scope.vservers,
      overlay = $scope.overlay.circular,
      currentState = $state.current.name.split('.');
    currentState.pop(), (currentState = currentState.join('.')), activate();
  }
  angular
    .module('app')
    .controllerProvider.register('VserversInfoCtrl', [
      '$scope',
      '$state',
      'translate',
      'vserversUtil',
      VserversInfoCtrl,
    ]);
})();
