'use strict';
angular
  .module('app')
  .constant('telnetConstants', { defined: { bcm: 'undefined' != typeof BCM } });
