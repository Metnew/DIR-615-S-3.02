'use strict';
!(function() {
  function navigationFilter(navigation) {
    function addRules(cb) {
      _rules.push(cb);
    }
    function rules() {
      if (_rules.length) {
        var composeRules = _.compose.apply(null, _rules);
        return composeRules({});
      }
      return {};
    }
    function addFilter(cb) {
      _filters.push(cb);
    }
    function filter() {
      if (_filters.length) {
        var composeFilter = _.compose.apply(null, _filters);
        return composeFilter(navigation);
      }
      return navigation;
    }
    var _filters = [],
      _rules = [];
    return {
      addRules: addRules,
      rules: rules,
      addFilter: addFilter,
      filter: filter,
    };
  }
  var m = angular.module(regdep('navigation-filter'), []);
  m.service('navigationFilter', ['navigation', navigationFilter]);
})();
