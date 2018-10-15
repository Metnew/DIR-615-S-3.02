'use strict';
!(function() {
  function routerHelperProvider(
    $locationProvider,
    $stateProvider,
    $urlRouterProvider
  ) {
    function RouterHelper($state) {
      function configureStates(states, otherwisePath) {
        states.forEach(function(state) {
          $stateProvider.state(state.state, state.config);
        });
      }
      function setOtherwise(otherwisePath) {
        otherwisePath &&
          !hasOtherwise &&
          ((hasOtherwise = !0), $urlRouterProvider.otherwise(otherwisePath));
      }
      function getStates() {
        return $state.get();
      }
      var hasOtherwise = !1,
        service = {
          configureStates: configureStates,
          setOtherwise: setOtherwise,
          getStates: getStates,
        };
      return service;
    }
    (this.$get = RouterHelper), (RouterHelper.$inject = ['$state']);
  }
  angular
    .module(regdep('ui.router.helper'), ['ui.router'])
    .provider('routerHelper', routerHelperProvider),
    (routerHelperProvider.$inject = [
      '$locationProvider',
      '$stateProvider',
      '$urlRouterProvider',
    ]);
})();
