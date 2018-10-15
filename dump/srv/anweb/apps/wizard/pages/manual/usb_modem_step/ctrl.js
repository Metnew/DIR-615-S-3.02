'use strict';
function UsbModemStepController(
  $scope,
  $rootScope,
  $stateParams,
  manualProfile,
  manualStepApiDispatcher,
  dongle,
  devinfo,
  device,
  $timeout,
  $state,
  translate,
  stepManager,
  constants
) {
  function activate() {
    dongle.state()
      ? dongleHandler({ dongle: $rootScope.gDongleData })
      : devinfo.once('net|dongle|notice').then(function(data) {
          dongleHandler({ dongle: $rootScope.gDongleData }),
            dongleHandler(data);
        }),
      startSubscribe(),
      ($scope.dongleStep.cancelWatch = $scope.$watch(
        'gDongleData.status',
        function(status) {
          !status &&
            dongle.state() &&
            (dongle.cleanInfo(),
            dongle.state('wait_dongle'),
            (profile.__modemFields = !1),
            startSubscribe());
        }
      ));
  }
  function deactivate() {
    $scope.showAvailOverlay(!0),
      stopSubscribe(),
      $scope.dongleStep.cancelWatch();
  }
  function usbModemLoaderHidden() {
    return (
      profile.__modemFields ||
      _.contains(
        [
          'intersected_subnet',
          'wan_created',
          'wan_failed',
          'wait_pin',
          'sim_is_blocked',
        ],
        dongle.state()
      )
    );
  }
  function startSubscribe() {
    stopSubscribe(), devinfo.subscribe('dongle|net|notice', dongleHandler);
  }
  function stopSubscribe() {
    devinfo.unsubscribe('dongle|net|notice', dongleHandler);
  }
  function dongleHandler(data) {
    if (data && data.dongle) {
      if (profile.__modemFields || 'wan_created' == dongle.state()) return;
      dongle.info(data.dongle),
        data.lteIntersectedSubnet
          ? dongle.state('intersected_subnet')
          : data.dongle.notUseSIM ||
            data.dongle.pinStatus ||
            !data.dongle.status ||
            'plugged' == data.dongle.status ||
            /^[0-9]+$/.test(data.dongle.imsi)
            ? 'pin_required' == data.dongle.pinStatus ||
              'puk_required' == data.dongle.pinStatus ||
              'puk2_required' == data.dongle.pinStatus
              ? data.dongle.pinTryLeft > 0
                ? (dongle.state('wait_pin'),
                  ($scope.dongleStep.modemPinStatus = data.dongle.pinStatus),
                  ($scope.dongleStep.modemTryLeft = data.dongle.pinTryLeft))
                : -1 == data.dongle.pinTryLeft
                  ? (dongle.state('wait_pin'),
                    console.log('data', data),
                    ($scope.dongleStep.modemPinStatus = data.dongle.pinStatus),
                    ($scope.dongleStep.modemTryLeft = null))
                  : dongle.state('sim_is_blocked')
              : 'wait_create' == dongle.state()
                ? '3g' == data.ipv4gw.contype || 'lte' == data.ipv4gw.contype
                  ? (dongle.state('wan_created'), stopSubscribe())
                  : _.now() - $rootScope.rootDongleReadyStamp >
                      $scope.dongleStep.modemAutoconnectTimeout &&
                    ((profile.__modemFields = !0),
                    dongle.state('wan_failed'),
                    stopSubscribe())
                : 'ready' != data.dongle.status ||
                  (data.dongle.pinStatus && 'ok' != data.dongle.pinStatus)
                  ? dongle.state('wait_dongle')
                  : data.dongle.autoconnect
                    ? (($scope.dongleStep.modemType = data.dongle.actualMode),
                      dongle.state('wait_create'))
                    : (dongle.state('wan_failed'), (profile.__modemFields = !0))
            : dongle.state('wait_sim');
    }
  }
  function modemApplyPIN() {
    $timeout(function() {
      $scope.$emit('goToErrorForm', !0);
    }),
      $scope.dongleStep.modemData.PIN &&
        ($rootScope.showOverlay(!0),
        $scope.showAvailOverlay(!1),
        dongle
          .applyPIN($scope.dongleStep.modemData.PIN)
          .then(function() {
            ($rootScope.rootDongleReadyStamp = _.now()),
              dongle.state('wait_create'),
              $rootScope.showOverlay(!1);
          })
          ['catch'](function() {
            $rootScope.showOverlay(!1),
              devinfo.once('dongle').then(function(data) {
                ($scope.dongleStep.modemPinStatus = data.dongle.pinStatus),
                  ($scope.dongleStep.modemTryLeft =
                    -1 == data.dongle.pinTryLeft
                      ? null
                      : data.dongle.pinTryLeft),
                  _.defer(function() {
                    alert(
                      -1 != data.dongle.pinTryLeft
                        ? translate('wizard_wrong_pin') +
                          '\r\n' +
                          translate('wizard_pin_attempt') +
                          ' ' +
                          data.dongle.pinTryLeft
                        : translate('wizard_wrong_pin')
                    );
                  });
              });
          }));
  }
  function formatPinMessage(error) {
    var pinType = $scope.translatePinStatus(error);
    return translate('wizard_unknown_pin').replace(/<TYPE>/, pinType);
  }
  function modemAbortCheck() {
    (profile.__modemFields = !0),
      stopSubscribe(),
      dongle.state('wan_failed'),
      $scope.nextStep();
  }
  function exit() {
    manualProfile.clean(), stepManager.action('exit');
  }
  $scope.constants = constants;
  var profile = manualProfile.profile();
  ($scope.dongleStep = {
    dongle: dongle,
    modemPIN: '',
    modemTryLeft: null,
    formatPinMessage: formatPinMessage,
    modemData: { PIN: '', tryCount: 0 },
    modemApplyPIN: modemApplyPIN,
    modemAutoconnectTimeout: 1e4,
    usbModemLoaderHidden: usbModemLoaderHidden,
    modemAbortCheck: modemAbortCheck,
    exit: exit,
  }),
    manualStepApiDispatcher.get().registerStepApi({
      name: 'UsbModemStep',
      onActivate: activate,
      onLeave: deactivate,
    });
}
angular
  .module('wizard')
  .controller('UsbModemStepController', UsbModemStepController),
  (UsbModemStepController.$inject = [
    '$scope',
    '$rootScope',
    '$stateParams',
    'manualProfile',
    'manualStepApiDispatcher',
    'dongle',
    'devinfo',
    'device',
    '$timeout',
    '$state',
    'translate',
    'stepManager',
    'wizardConstants',
  ]);
