'use strict';
angular.module('wizard').controller('wizardLangCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  'translate',
  'profiles',
  'detectLang',
  'stepManager',
  function(
    $scope,
    $rootScope,
    $state,
    translate,
    profiles,
    detectLang,
    stepManager
  ) {
    $scope.device;
    return (
      ($scope.detect = detectLang()),
      ($scope.showlist = !1),
      ($scope.avail = 'eng rus'.split(' ')),
      1 == _.size($scope.avail)
        ? (translate.changeLanguage($scope.avail[0]),
          void stepManager.action('next'))
        : (_.contains($scope.avail, $scope.detect) ||
            (($scope.undetectedLang = !0), ($scope.showlist = !0)),
          ($scope.yes = function() {
            translate.changeLanguage($scope.detect), stepManager.action('next');
          }),
          ($scope.no = function() {
            $scope.showlist = !0;
          }),
          ($scope.change = function(lang) {
            translate.changeLanguage(lang), stepManager.action('next');
          }),
          void ($scope.isActivated = !0))
    );
  },
]);
