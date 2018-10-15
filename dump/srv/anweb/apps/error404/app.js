'use strict';
!(function() {
  function Error404Ctrl(
    $scope,
    $window,
    $location,
    $timeout,
    translate,
    devinfo
  ) {
    function activate() {
      devinfo.init(),
        updateTimeout(),
        devinfo.once('version').then(function(data) {
          data && data.lang && translate.changeLanguage(data.lang),
            ($scope.isActivate = !0);
        });
    }
    function updateTimeout() {
      promise = $timeout(function() {
        time > 1 ? (time--, updateTimeout()) : goToStart();
      }, 1e3);
    }
    function getTime() {
      return time > 0 ? ' (' + time + ')' : '';
    }
    function goToStart() {
      var url =
        $location.protocol() +
        '://' +
        $location.host() +
        ':' +
        $location.port();
      $timeout.cancel(promise), ($window.location.href = url);
    }
    ($scope.isActivate = !1),
      ($scope.goToStart = goToStart),
      ($scope.getTime = getTime);
    var time = 10,
      promise = null;
    activate();
  }
  appDeps = appDeps.concat(['nw']);
  var app = angular.module('error404', appDeps);
  app.controller('Error404Ctrl', [
    '$scope',
    '$window',
    '$location',
    '$timeout',
    'translate',
    'devinfo',
    Error404Ctrl,
  ]);
})();
