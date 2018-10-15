'use strict';
!(function() {
  function lanHelper(supported, constraints) {
    return { supported: supported, constraints: constraints };
  }
  angular
    .module('app')
    .factory('lanHelper', ['lanSupported', 'lanConstraints', lanHelper]);
})();
