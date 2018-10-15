'use strict';
angular.module(regdep('history'), []).service('history', [
  function() {
    var history = [],
      cleanLastHistory = !1,
      add = function(obj) {
        return history.push(obj), history;
      },
      update = function(obj, pos) {
        if (0 > pos) var currentHistory = history[history.length + pos];
        else var currentHistory = history[pos];
        return _.extend(currentHistory, obj), currentHistory;
      },
      remove = function(start, end) {
        return (history = history.slice(start, end));
      },
      clearAll = function() {
        return remove(0, history.length), history;
      },
      getObj = function(pos) {
        return 0 > pos ? history[history.length + pos] : history[pos];
      },
      isCleanLastHistory = function() {
        return cleanLastHistory;
      },
      setCleanLastHistory = function(value) {
        cleanLastHistory = value;
      };
    return {
      add: add,
      update: update,
      remove: remove,
      clearAll: clearAll,
      getObj: getObj,
      isCleanLastHistory: isCleanLastHistory,
      setCleanLastHistory: setCleanLastHistory,
    };
  },
]);
