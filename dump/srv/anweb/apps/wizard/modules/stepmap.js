'use strict';
angular.module(regdep('step-map'), []).service('stepMap', [
  '$q',
  '$rootScope',
  '$state',
  'regions',
  'devinfo',
  'queryString',
  'manualProfile',
  function($q, $rootScope, $state, regions, devinfo, qs, manualProfile) {
    function profileBackStateLogic() {
      return $q.when(
        $rootScope.enableSmallWizard
          ? { step: 'step_info' }
          : _.size($rootScope.servicelist) > 1
            ? { step: 'step_servicelist' }
            : _.size($rootScope.providers) > 1
              ? { step: 'step_provlist' }
              : { step: 'step_search' }
      );
    }
    function profileStateLogic(data) {
      if (
        (($rootScope.providers = _.groupBy(data, 'Provider')),
        _.size($rootScope.providers) > 1)
      )
        return $q.when({ step: 'step_provlist' });
      if (1 == _.size($rootScope.providers)) {
        if (
          (($rootScope.servicelist = _.find($rootScope.providers, function() {
            return !0;
          })),
          _.size($rootScope.servicelist) > 1)
        )
          return $q.when({ step: 'step_servicelist' });
        if (1 == _.size($rootScope.servicelist))
          return (
            ($rootScope.selectedProfile = _.first($rootScope.servicelist)),
            $q.when({ step: 'step_master' })
          );
      }
      return $q.when({ step: 'step_search_fail' });
    }
    var map = {
      $awayURL: 'www.yandex.com',
      $init: function(data) {
        return (
          console.log('redirect url:', $rootScope.getRedirectUrl()),
          qs.finish
            ? $q.when({ step: 'step_finish', args: { net: 'skiped' } })
            : qs.reload
              ? $q.when({ step: 'step_status' })
              : 'dcc_applying' == data.dccStatus
                ? $q.when({ step: 'step_status' })
                : qs.checkUpdate
                  ? $q.when({ step: 'step_status' })
                  : data.factorySettings
                    ? (devinfo.init({ need_auth: !0 }),
                      $q.when({ step: 'step_info' }))
                    : $q.when({ step: 'step_reset' })
        );
      },
      step_finish: { page: 'finish' },
      step_reset: { page: 'reset' },
      step_defaults: {
        page: 'defaults',
        data: { btn_prev: !1 },
        action: function(event) {
          return 'prev' == event
            ? $q.when({ step: 'step_skipwizard' })
            : void 0;
        },
      },
      step_defaults_manual: {
        page: 'defaults',
        data: { btn_prev: !1 },
        action: function(event) {
          return 'prev' == event ? $q.when({ step: 'step_manual' }) : void 0;
        },
      },
      step_status: { page: 'status' },
      step_trouble: { page: 'trouble' },
      step_servicelist: { page: 'servicelist' },
      step_provlist: { page: 'provlist' },
      step_lang: {
        page: 'lang',
        action: function(event) {
          return 'next' == event
            ? $q.when({ step: 'step_skipwizard' })
            : void 0;
        },
      },
      step_skipwizard: {
        page: 'skipwizard',
        data: { btn_exit: !0, btn_next: !0 },
        activate: function() {
          manualProfile.clean();
        },
        action: function(event, data) {
          if ('next' == event) return $q.when({ step: 'step_manual' });
          if ('exit' == event) {
            var deferred = $q.defer();
            return (
              devinfo.once('notice').then(function(data) {
                'NeedChangePass' == data.systemNotice ||
                data.needChangeSSID24 ||
                data.needChangeSSID5
                  ? deferred.resolve({ step: 'step_defaults' })
                  : $rootScope.exitFromWizard(!0);
              }),
              deferred.promise
            );
          }
        },
      },
      step_manual: {
        page: 'manual',
        data: {},
        action: function(event, data) {
          return 'prev' == event
            ? $q.when({ step: 'step_skipwizard' })
            : 'next' == event
              ? $q.when(
                  $rootScope.gWANStatus || !data.isCableConnect || data.isAP
                    ? { step: 'step_summary', args: { prev: 'manual' } }
                    : { step: 'step_cable_last' }
                )
              : 'exit' == event
                ? $q.when({ step: 'step_defaults_manual' })
                : void 0;
        },
      },
      step_master: {
        page: 'master',
        data: { btn_prev: !0 },
        action: function(event, data) {
          return 'next' == event
            ? $q.when(
                data.cable
                  ? { step: 'step_summary' }
                  : { step: 'step_cable_last' }
              )
            : 'prev' == event
              ? profileBackStateLogic()
              : void 0;
        },
      },
      step_summary: {
        page: 'summary',
        data: {},
        action: function(event, data) {
          return 'apply' == event
            ? $q.when(
                data && data.error
                  ? { step: 'step_status', args: { error: !0 } }
                  : { step: 'step_status' }
              )
            : 'prev' == event
              ? $q.when({ step: 'step_manual' })
              : void 0;
        },
      },
      step_info: {
        page: 'info',
        action: function(event) {
          return 'next' == event ? $q.when({ step: 'step_cable' }) : void 0;
        },
      },
      step_cable: {
        page: 'checkcable',
        data: { btn_next: !0, btn_prev: !1 },
        action: function(event) {
          return 'next' == event ? $q.when({ step: 'step_search' }) : void 0;
        },
      },
      step_cable_last: {
        page: 'checkcable',
        data: { btn_next: !0, btn_prev: !0 },
        action: function(event) {
          return 'next' == event
            ? $q.when({ step: 'step_summary' })
            : 'prev' == event
              ? $q.when({ step: 'step_manual' })
              : void 0;
        },
      },
      step_search_fail: {
        page: 'search_fail',
        data: { btn_exit: !0, btn_prev: !0 },
        action: function(event) {
          if ('exit' == event) $rootScope.exitFromWizard(!0);
          else if ('prev' == event) return $q.when({ step: 'step_search' });
        },
      },
      step_search: {
        page: 'search',
        data: { btn_manual: !0, btn_next: !0, btn_prev: !1 },
        action: function(event, data) {
          return 'selected' == event ? profileStateLogic(data) : void 0;
        },
      },
    };
    return map;
  },
]);
