'use strict';
!(function() {
  function SysNtpCtrl($scope, $state, util, funcs, snackbars) {
    function init() {
      function success() {
        (helper = util.makeHelper()),
          (systemTime.data = helper.getData()),
          (systemTime.timeStamp = helper.getTimeStamp(systemTime.data.time)),
          (systemTime.options = {
            years: _.range(1970, 2039),
            months: _.range(1, 13),
            days: _.range(1, 32),
            hours: _.range(24),
            mins: _.range(60),
            timezones: getTimeZones(),
          }),
          (__backup = funcs.deepClone(systemTime.data)),
          $scope.$watch('systemTime.time.Year', changeDaysRange),
          $scope.$watch('systemTime.time.Month', changeDaysRange),
          util.subscribeTime(function(time) {
            systemTime.timeStamp = helper.getTimeStamp(time);
          }, $scope);
      }
      function error() {
        $state.go('error', { code: 'pullError', message: 'pullErrorDesc' });
      }
      util
        .pull()
        .then(success)
        ['catch'](error)
        ['finally']($scope.$emit.bind($scope, 'pageload'));
    }
    function apply() {
      function success() {
        snackbars.add('apply_success'), init();
      }
      function error() {
        $state.go('error', { code: 'pushError', message: 'pushErrorDesc' });
      }
      if (!$scope.ntpSettings.$invalid) {
        var overlay = $scope.overlay.circular,
          overlayId = overlay.start(),
          config = helper.formConfig(systemTime.data);
        util
          .apply(config)
          .then(success)
          ['catch'](error)
          ['finally'](overlay.stop.bind(overlay, overlayId));
      }
    }
    function addServer() {
      ($scope.systemTime.focus = !0),
        systemTime.data.ntp.Server.push({ address: '' });
    }
    function removeServer(inx) {
      systemTime.data.ntp.Server.splice(inx, 1);
    }
    function deteremineTimezone() {
      var offset = (
          (100 * -(new Date().getTimezoneOffset() / 60)) /
          100
        ).toFixed(2),
        arrOffset = offset.split('.');
      systemTime.data.ntp.TimeZoneOffset = helper.unionOffset(
        arrOffset[0],
        arrOffset[1]
      );
    }
    function setLocalTime() {
      var local = new Date(),
        time = systemTime.data.time;
      (time.Year = local.getFullYear()),
        (time.Month = local.getMonth() + 1),
        (time.Day = local.getDate()),
        (time.Hour = local.getHours()),
        (time.Minute = local.getMinutes());
    }
    function changeDaysRange() {
      function getMonthDays(year, month) {
        return new Date(year, month, 0).getDate();
      }
      function getLastDay() {
        return systemTime.options.days.slice(-1)[0];
      }
      var time = systemTime.data.time,
        year = time.Year,
        month = time.Month;
      systemTime.options.days = _.range(1, getMonthDays(year, month) + 1);
      var lastDay = getLastDay();
      time.Day > lastDay && (time.Day = lastDay);
    }
    function getTimeZones() {
      var list = helper.getTimeZones();
      return _.map(list, function(elem) {
        var langKey = '-' == elem.sign ? 'ntpTzMinus' : 'ntpTz';
        return (elem.name = langKey + Math.abs(elem.name)), elem;
      });
    }
    function isShowServerList() {
      return (
        systemTime.data &&
        systemTime.data.ntp.Enable &&
        !systemTime.data.ntp.UseDHCP
      );
    }
    function isSupportedNtp(param) {
      return _.has(systemTime.data.ntp, param);
    }
    function wasModified() {
      return __backup && !funcs.deepEqual(__backup, systemTime.data);
    }
    $scope.systemTime = {
      data: null,
      timeStamp: null,
      options: null,
      apply: apply,
      addServer: addServer,
      removeServer: removeServer,
      deteremineTimezone: deteremineTimezone,
      setLocalTime: setLocalTime,
      isShowServerList: isShowServerList,
      isSupportedNtp: isSupportedNtp,
      wasModified: wasModified,
    };
    var helper,
      systemTime = $scope.systemTime,
      __backup = null;
    init();
  }
  angular
    .module('app')
    .controllerProvider.register('SysNtpCtrl', [
      '$scope',
      '$state',
      'systemNtpUtil',
      'funcs',
      'snackbars',
      SysNtpCtrl,
    ]);
})();
