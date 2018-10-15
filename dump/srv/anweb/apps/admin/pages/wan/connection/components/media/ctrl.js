'use strict';
!(function() {
  function WanMediaCtrl($scope, $stateParams, translate, helper) {
    function clean() {
      ($scope.media.type = null), ($scope.media.data = {});
    }
    function update() {
      ($scope.media.type = $scope.wan.model.connection.MediaType),
        ($scope.media.data = $scope.wan.model.connection.Media);
    }
    ($scope.media = { type: null, data: {}, clean: clean, update: update }),
      $scope.wan.model.connection.Media && $scope.wan.model.connection.MediaType
        ? update()
        : clean(),
      $scope.$on('wan.model.connection.media.clean', clean),
      $scope.$on('wan.model.connection.media.set', update);
  }
  angular
    .module('app')
    .controller('WanMediaCtrl', [
      '$scope',
      '$stateParams',
      'translate',
      'wanHelper',
      WanMediaCtrl,
    ]);
})();
