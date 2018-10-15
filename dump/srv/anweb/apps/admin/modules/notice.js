'use strict';
function NoticeQueue(notifications) {
  function add(name, notificationView) {
    this.queue[name] = notificationView;
  }
  function push() {
    _.each(
      this.queue,
      function(notification, name) {
        _.contains(this.showedList, name) ||
          (notifications.add(notification), this.showedList.push(name));
      }.bind(this)
    ),
      (this.queue = {});
  }
  function remove(name) {
    this.queue = _.omit(this.queue, name);
  }
  function forget(name) {
    this.showedList = _.without(this.showedList, name);
  }
  function addShowed(name) {
    _.contains(this.showedList, name) || this.showedList.push(name);
  }
  _.extend(this, {
    queue: {},
    showedList: [],
    addToQueue: add,
    removeFromQueue: remove,
    addShowed: addShowed,
    forgetShowing: forget,
    pushNotifications: push,
  });
}
angular.module(regdep('notice'), []).service('notice', [
  '$rootScope',
  '$state',
  'devinfo',
  'device',
  'funcs',
  'ngDialog',
  'authDigestCredentialsStorage',
  'authDigestRealmStorage',
  '$timeout',
  'noticeQueue',
  'translate',
  'cookie',
  function(
    $rootScope,
    $state,
    devinfo,
    device,
    funcs,
    ngDialog,
    authDigestCredentialsStorage,
    authDigestRealmStorage,
    $timeout,
    noticeQueue,
    translate,
    cookie
  ) {
    function getNoticeView(notice, params) {
      return notice.view
        ? _.extend({}, notice.view, {
            getDescription: _.isFunction(notice.view.description)
              ? notice.view.description.bind(null, params)
              : function() {
                  return notice.view.description;
                },
          })
        : null;
    }
    var noticeConfig = {
        NeedSave: {
          name: 'Save',
          priority: 5,
          addCallback: function() {
            return !isExistNotice('SaveAndReboot');
          },
          addNotice: function(noticeView) {
            isExistNotice('SaveAndReboot') ||
              noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            description: 'noticeSaveDescription',
            name: 'save',
            icon: 'save',
            actions: [
              {
                icon: 'apply',
                primary: !0,
                text: 'noticeSaveTitle',
                handler: function() {
                  return device.system.save();
                },
              },
              {
                icon: 'arrow-revert',
                primary: !1,
                text: 'cancelButton',
                handler: function() {
                  confirm(translate('notification_reset_changes_confirm')) &&
                    device.system.reboot();
                },
              },
            ],
          },
        },
        NeedSaveAndReboot: {
          name: 'SaveAndReboot',
          priority: 5,
          addNotice: function(noticeView) {
            noticeQueue.removeFromQueue('Save'),
              noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            description: 'noticeSaveAndRebootDescription',
            name: 'saveAndReboot',
            icon: 'save_and_reboot',
            actions: [
              {
                icon: 'apply',
                text: 'noticeSaveAndRebootTitle',
                primary: !0,
                handler: function() {
                  confirm(translate('save_and_reboot_confirm')) &&
                    device.system.reboot(!0);
                },
              },
            ],
          },
          addCallback: function() {
            return remove('NeedSave', !1), !0;
          },
        },
        NeedChangeDefaultSettings: {
          name: 'ChangeDefaults',
          priority: 6,
          addCallback: function(params) {
            return (
              $timeout(function() {
                var realm = authDigestRealmStorage.getCurrent(),
                  authHeader = authDigestCredentialsStorage.get(realm);
                return !authHeader && params.needChangePass
                  ? !1
                  : (auto.stop(),
                    void ngDialog
                      .open({
                        template: 'dialogs/change_pass/dialog.tpl.html',
                        className: 'change_pass_dialog',
                        closeByDocument: !1,
                        closeByEscape: !1,
                        controller: ChangePassDialogCtrl,
                        showClose: !1,
                        data: params,
                      })
                      .closePromise.then(function(data) {
                        auto.start();
                      }));
              }),
              !1
            );
          },
        },
        FirmwareUpdateAvailable: {
          name: 'FirmwareUpdateAvailable',
          priority: 4,
          addNotice: function(noticeView) {
            noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            name: 'firmwareUpdate',
            description: function(params) {
              return (
                translate('noticeFirmwareUpdateAvailableDescription1') +
                ' ' +
                params.updateVersion +
                ' ' +
                translate('noticeFirmwareUpdateAvailableDescription2')
              );
            },
            icon: 'firmware_remote_update',
            actions: [
              {
                icon: 'apply',
                text: 'noticeFirmwareUpdateAvailableTitle',
                primary: !0,
                handler: function() {
                  function success() {
                    $rootScope.$emit('device.action.started', {
                      action: 'fwupdate.remote',
                    });
                  }
                  function error() {
                    alert(translate('invalid_remote_firmware')),
                      location.reload();
                  }
                  confirm(translate('fwupdate_confirm')) &&
                    device.system.remoteUpdate(success, error);
                },
              },
            ],
          },
        },
        NeedEnterPINPUK: {
          name: 'NeedEnterPINPUK',
          priority: 7,
          addNotice: function(noticeView) {
            noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            name: 'needEnterPin',
            description: function(params) {
              var name =
                'pin' == params.name
                  ? 'PIN'
                  : 'puk' == params.name
                    ? 'PUK'
                    : 'PUK2';
              return translate('noticeNeedEnterPINDescription') + ' ' + name;
            },
            icon: 'sim_card',
            actions: [
              {
                icon: 'go_to_page',
                text: 'noticeNeedEnterPINEnter',
                primary: !0,
                handler: function() {
                  'usbmodem.pin' != !$state.current.name &&
                    $state.go('usbmodem.pin');
                },
              },
            ],
          },
        },
        unreadMessages: {
          name: 'unreadMessages',
          priority: 8,
          addNotice: function(noticeView) {
            noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            name: 'youHaveUnreadMessages',
            description: function(params) {
              return translate('noticeYouHaveUnreadMessages');
            },
            icon: 'unread_mess',
            actions: [
              {
                icon: 'go_to_page',
                text: 'noticeYouHaveUnreadMessagesRead',
                primary: !0,
                handler: function() {
                  'usbmodem.sms' != !$state.current.name &&
                    $state.go('usbmodem.sms');
                },
              },
            ],
          },
        },
        lteIntersectedSubnet: {
          name: 'lteIntersectedSubnet',
          priority: 10,
          addNotice: function(noticeView) {
            noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            icon: 'need_change_lan_subnet',
            name: 'noticeLteIntersectedSubnet',
            description: function(params) {
              return (
                translate('noticeLteIntersectedSubnetDescription') +
                ' ' +
                params.name +
                '. ' +
                translate('noticeLteIntersectedSubnetDescription2')
              );
            },
            actions: [
              {
                icon: 'go_to_page',
                text: 'noticeLteIntersectedSubnetEnableGo',
                primary: !0,
                handler: function() {
                  'network.lan' != !$state.current.name &&
                    $state.go('network.lan');
                },
              },
            ],
          },
        },
        wanIntersectedSubnet: {
          name: 'wanIntersectedSubnet',
          priority: 10,
          addNotice: function(noticeView) {
            noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            icon: 'warning',
            name: 'noticeWANIntersectedSubnet',
            description: function() {
              return translate('noticeWANIntersectedSubnetDescription');
            },
            actions: [
              {
                icon: 'go_to_page',
                text: 'noticeWANIntersectedSubnetEnableGo',
                primary: !0,
                handler: function() {
                  'network.lan' != !$state.current.name &&
                    $state.go('network.lan');
                },
              },
            ],
          },
        },
        needUpdateMac: {
          name: 'needUpdateMac',
          priority: 10,
          addNotice: function(noticeView) {
            noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            name: 'noticeNeedUpdateMac',
            description: 'noticeNeedUpdateMac',
            icon: 'need_update_mac',
          },
        },
        hotWifiEnable: {
          name: 'hotWifiEnable',
          priority: 10,
          addNotice: function(noticeView) {
            noticeQueue.addToQueue(this.name, noticeView);
          },
          view: {
            name: 'hotWifiEnable',
            description: 'noticeHotWifiEnableDesc',
            actions: [
              {
                icon: 'go_to_page',
                text: 'noticeHotWifiEnableGo',
                primary: !0,
                handler: function() {
                  'advanced.hot_wif' != !$state.current.name &&
                    $state.go('advanced.hot_wifi');
                },
              },
            ],
          },
        },
      },
      notices = [],
      skipNextNeedSave = !1,
      hasUnshowed = !1;
    $rootScope.notice = { count: 0 };
    var auto = new function() {
        var handlers = [];
        (this.start = function() {
          devinfo.skipAuth.onceAndSubscribe('notice', auto.update);
        }),
          (this.stop = function() {
            devinfo.skipAuth.unsubscribe('notice', auto.update);
          }),
          (this.subscribe = function(handler) {
            if (!~_.indexOf(handlers, handler)) {
              handlers.push(handler);
              var list = getList();
              return handler(list), !0;
            }
            return !1;
          }),
          (this.update = function(data) {
            if (data) {
              var systemNotices = ['NeedSave', 'NeedSaveAndReboot'];
              if (
                (_.each(systemNotices, function(notice) {
                  data.systemNotice == notice
                    ? skipNextNeedSave ||
                      (add(notice, null, !1), (hasUnshowed = !1))
                    : remove(notice, !1);
                }),
                'NeedChangePass' == data.systemNotice ||
                  data.needChangeSSID24 ||
                  data.needChangeSSID5)
              ) {
                var params = {
                  needChangeSSID24: data.needChangeSSID24,
                  needChangeSSID5: data.needChangeSSID5,
                  needChangePass: 'NeedChangePass' == data.systemNotice,
                };
                add('NeedChangeDefaultSettings', params, !1);
              }
              if (
                ('update_available' == data.updateStatus
                  ? add(
                      'FirmwareUpdateAvailable',
                      { updateVersion: data.updateVersion },
                      !1
                    )
                  : remove('FirmwareUpdateAvailable', !1),
                data.needEnterPINPUK)
              ) {
                var pinNotice = get('NeedEnterPINPUK');
                pinNotice &&
                  pinNotice.params.name != data.needEnterPINPUK &&
                  remove('NeedEnterPINPUK', !1),
                  add('NeedEnterPINPUK', { name: data.needEnterPINPUK }, !1);
              } else remove('NeedEnterPINPUK', !1);
              if (
                (data.unreadMessages
                  ? add('unreadMessages', { name: data.unreadMessages }, !1)
                  : remove('unreadMessages', !1),
                data.needUpdateMAC
                  ? add('needUpdateMac', { name: data.needUpdateMac }, !1)
                  : remove('needUpdateMac', !1),
                data.lteIntersectedSubnet)
              ) {
                {
                  get('lteIntersectedSubnet');
                }
                add(
                  'lteIntersectedSubnet',
                  { name: data.lteIntersectedSubnet },
                  !1
                );
              } else remove('lteIntersectedSubnet', !1);
              var isAPMode = 'ap' === cookie.get('device_mode');
              if (data.brConflict && !isAPMode) {
                {
                  get('wanIntersectedSubnet');
                }
                add('wanIntersectedSubnet', null, !1);
              } else remove('wanIntersectedSubnet', !1);
              data.hotWifiEnable
                ? add('hotWifiEnable')
                : remove('hotWifiEnable');
            }
            noticeQueue.pushNotifications(),
              ($rootScope.notice.count = count());
            for (var index in handlers) handlers[index]();
          });
      }(),
      indexInList = function(name) {
        for (var r = 0; notices[r]; ) {
          if (notices[r].name == name) return r;
          r++;
        }
        return -1;
      },
      isExistNotice = function(name) {
        return -1 != indexInList(name);
      },
      sortListPriority = function(list) {
        list.sort(function(a, b) {
          return b.priority - a.priority;
        });
      },
      get = function(name) {
        var index = indexInList(name);
        return ~index ? notices[index] : !1;
      },
      getList = function() {
        return sortListPriority(notices), notices;
      },
      add = function(type) {
        var params =
            arguments.length <= 1 || void 0 === arguments[1]
              ? {}
              : arguments[1],
          sw_update =
            arguments.length <= 2 || void 0 === arguments[2]
              ? !0
              : arguments[2],
          notice = noticeConfig[type];
        if (!notice) return !1;
        var name = notice.name,
          priority = notice.priority || 0,
          noticeView = getNoticeView(notice, params);
        if (
          (_.has(notice, 'addNotice') && !notice.addNotice(noticeView),
          isExistNotice(name))
        )
          return !1;
        if (_.has(notice, 'addCallback') && !notice.addCallback(params))
          return !1;
        var notify = {
          name: name,
          priority: priority,
          params: params,
          view: noticeView,
        };
        return notices.push(notify), sw_update && auto.update(), !0;
      },
      remove = function(type) {
        var sw_update =
            arguments.length <= 1 || void 0 === arguments[1]
              ? !0
              : arguments[1],
          fg = !1,
          types = type.split('|');
        return (
          _.each(types, function(value) {
            var notice = noticeConfig[value];
            if (notice) {
              var _index = indexInList(notice.name);
              ~_index && (notices.splice(_index, 1), (fg = !0)),
                noticeQueue.forgetShowing(notice.name);
            }
          }),
          fg && sw_update && auto.update(),
          fg
        );
      },
      clear = function() {
        (notices = []), auto.update();
      },
      count = function() {
        return notices.length;
      };
    return (
      auto.start(),
      {
        add: add,
        remove: remove,
        get: get,
        getList: getList,
        clear: clear,
        count: count,
        subscribe: auto.subscribe,
        start: auto.start,
        stop: auto.stop,
      }
    );
  },
]),
  angular.module('app').service('noticeQueue', NoticeQueue),
  (NoticeQueue.$inject = ['notifications']);
