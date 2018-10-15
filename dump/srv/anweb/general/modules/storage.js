'use strict';
!(function() {
  function anwebStorageService(localStorageService) {
    function make(name) {
      return new Storage(name);
    }
    function Storage(name) {
      function get(param) {
        var storage = getStorage();
        return _.isUndefined(storage[param]) ? null : storage[param];
      }
      function set(param, value) {
        var storage = getStorage();
        (storage[param] = value), setStorage(storage);
      }
      function clearAll() {
        removeParam(name);
      }
      function init() {
        setParam(name, JSON.stringify({}));
      }
      function isInitStorage() {
        return !!getParam(name);
      }
      function getStorage() {
        var result = getParam(name);
        return JSON.parse(result);
      }
      function setStorage(storage) {
        setParam(name, JSON.stringify(storage));
      }
      function getParam(param) {
        return localStorageService.get(param);
      }
      function setParam(param, value) {
        localStorageService.set(param, value);
      }
      function removeParam(param) {
        localStorageService.remove(param);
      }
      return (
        isInitStorage() || init(), { get: get, set: set, clearAll: clearAll }
      );
    }
    return { make: make };
  }
  var anwebStorage = angular.module('anweb-storage', ['LocalStorageModule']);
  anwebStorage.service('anwebStorage', [
    'localStorageService',
    anwebStorageService,
  ]);
})();
