'use strict';
!(function() {
  angular.module('wizard').service('supportInfoLoader', [
    'supportInfoConfig',
    'devinfo',
    function(config, devinfo) {
      function update() {
        var areas = _.chain(config.fields)
          .map(function(item) {
            return item.areas;
          })
          .flatten()
          .uniq()
          .value();
        _.size(areas) &&
          devinfo.once(areas.join('|')).then(function(data) {
            data &&
              _.each(config.fields, function(item) {
                binds[item.name] = item.handler(data);
              });
          });
      }
      function createGetter(name) {
        return function() {
          return binds[name];
        };
      }
      var binds = {};
      return (
        _.each(config.fields, function(field) {
          binds[field.name] = null;
        }),
        { update: update, createGetter: createGetter }
      );
    },
  ]);
})();
