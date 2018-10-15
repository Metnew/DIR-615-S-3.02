'use strict';
!(function() {
  angular.module(regdep('navfilters-generic'), []).run([
    'navigationFilter',
    'cookie',
    function(nfilter, cookie) {
      nfilter.addFilter(function(navs) {
        var deviceMode = cookie.get('device_mode'),
          exclude = [];
        return (
          'ap' === deviceMode
            ? _.each(navs, function(state, name) {
                state.hideInAPMode && exclude.push(name);
              })
            : _.each(navs, function(state, name) {
                state.hideInRouterMode && exclude.push(name);
              }),
          _.omit(navs, exclude)
        );
      });
    },
  ]);
})();
