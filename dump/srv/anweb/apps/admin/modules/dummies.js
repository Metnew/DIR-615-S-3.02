'use strict';
angular.module(regdep('dummies'), []).service('checkFactory', [
  function() {
    (this.start = function() {}), (this.stop = function() {});
  },
]);
