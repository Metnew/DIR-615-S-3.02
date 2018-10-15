'use strict';
!(function() {
  var nw = angular.module(regdep('nw-nocache'), []);
  nw.filter('nocache', function() {
    var rand = _.random(1e5, 999999);
    return function(input) {
      return input + '?' + rand;
    };
  });
})();
