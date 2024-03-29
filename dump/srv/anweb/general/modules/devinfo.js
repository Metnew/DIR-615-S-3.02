'use strict';
!(function() {
  function Devinfo(inject) {
    (this.__$http = inject.$http),
      (this.__$timeout = inject.$timeout),
      (this.__$q = inject.$q),
      (this.__setting = {
        min_interval: 4,
        interval: 4,
        timeout: 1e4,
        url: '/devinfo',
      }),
      (this.__handlers = []),
      (this.__activeTimer = !1),
      (this.__isSuspended = !1);
  }
  function init(obj) {
    _.extend(this.__setting, obj);
  }
  function once(s_area, config, mode) {
    function success(data) {
      return _.isObject(data)
        ? void deferred.resolve(data.result)
        : deferred.reject();
    }
    var deferred = this.__$q.defer();
    if (s_area && s_area.length > 0) {
      var url =
          this.__setting.url +
          ('?area=' + s_area) +
          ('&_=' + _.random(1e4, 99999)) +
          (this.__setting.need_auth ? '&need_auth=1' : '') +
          ('pull' != mode ? '&mandatory=1' : ''),
        opts = {
          timeout:
            config && config.timeout ? config.timeout : this.__setting.timeout,
        };
      this.__$http
        .get(url, opts)
        .success(success)
        .error(function() {
          return deferred.reject();
        });
    }
    return deferred.promise;
  }
  function subscribe(s_area, handler, scope) {
    var _this = this;
    if (!_.isString(s_area) || !_.isFunction(handler))
      return { status: !1, mess: 'Incorrect arguments' };
    scope &&
      scope.$on('$destroy', function() {
        return _this.unsubscribe(s_area, handler);
      });
    var a_area = s_area.split('|'),
      found_handler = _.findWhere(this.__handlers, { func: handler });
    return found_handler
      ? ((a_area = _.difference(a_area, found_handler.area)),
        a_area.length
          ? ((found_handler.area = _.union(found_handler.area, a_area)),
            (this.__handlers = this.__handlers.filter(function(h) {
              return h.func != handler;
            })),
            this.__handlers.push(found_handler),
            { status: !0, mess: 'Successfully added area for the handler' })
          : { status: !1, mess: 'Such handler already exists' })
      : (this.__handlers.push({ func: handler, area: a_area }),
        __start.call(this),
        { status: !0, mess: 'Successfully added' });
  }
  function onceAndSubscribe(s_area, handler, scope) {
    this.once(s_area)
      .then(handler)
      ['finally'](this.subscribe.bind(this, s_area, handler, scope));
  }
  function unsubscribe(s_area, handler) {
    if (_.isEmpty(s_area))
      return (
        (this.__handlers.length = 0),
        { status: !0, mess: 'All handlers successfully removed' }
      );
    var incorrectHandler = handler && !_.isFunction(handler);
    if (!_.isString(s_area) || incorrectHandler)
      return { status: !1, mess: 'Incorrect arguments' };
    var a_area = s_area.split('|');
    if (!handler)
      return (
        this.__handlers.forEach(function(h) {
          return (h.area = _.difference(h.area, a_area));
        }),
        (this.__handlers = this.__handlers.filter(function(h) {
          return h.area.length;
        })),
        { status: !0, mess: 'Successfully deleted area for all handlers' }
      );
    var found_handler = _.findWhere(this.__handlers, { func: handler });
    if (!found_handler) return { status: !1, mess: 'The handler is not found' };
    var old_area = found_handler.area;
    return (
      (found_handler.area = _.difference(found_handler.area, a_area)),
      found_handler.area.length
        ? old_area.length > found_handler.area.length
          ? { status: !0, mess: 'Successfully deleted area for the handler' }
          : { status: !1, mess: 'Area for handler is not found' }
        : ((this.__handlers = this.__handlers.filter(function(h) {
            return h.func != handler;
          })),
          { status: !0, mess: 'Successfully deleted handler' })
    );
  }
  function suspend() {
    this.__isSuspended = !0;
  }
  function resume() {
    this.__isSuspended && ((this.__isSuspended = !1), __start.call(this));
  }
  function __start() {
    function success(data) {
      var min = _.min(data.infoAreasStatus, function(a) {
        return a.expTimeSec;
      });
      (this.__setting.interval =
        min.expTimeSec && min.expTimeSec > this.__setting.min_interval
          ? min.expTimeSec
          : this.__setting.min_interval),
        refresh.call(this);
    }
    function refresh() {
      var _this2 = this;
      this.__$timeout(function() {
        (_this2.__activeTimer = !1), __start.call(_this2);
      }, 1e3 * this.__setting.interval);
    }
    this.__handlers.length &&
      !this.__isSuspended &&
      (this.__activeTimer ||
        ((this.__activeTimer = !0),
        __pull.call(this).then(success.bind(this), refresh.bind(this))));
  }
  function __pull(s_area) {
    var _this3 = this,
      handlersCopy = _.clone(this.__handlers),
      getActualHandlers = function() {
        return _.intersection(handlersCopy, _this3.__handlers);
      };
    _.isEmpty(s_area) &&
      (s_area = handlersCopy
        .reduce(function(a, handler) {
          return _.union(a, handler.area);
        }, [])
        .join('|'));
    var deferred = this.once(s_area, null, 'pull');
    return (
      deferred.then(function(data) {
        return __startHandlers(data, getActualHandlers());
      }),
      deferred['catch'](function() {
        getActualHandlers().forEach(function(handler) {
          return handler.func(null, 'pull error');
        });
      }),
      deferred
    );
  }
  function __startHandlers(fulldata, actualHandlers) {
    actualHandlers.forEach(function(handler) {
      var infoAreasStatus = fulldata.infoAreasStatus,
        mask = [],
        data = {};
      handler.area.forEach(function(area) {
        !infoAreasStatus[area] ||
          !infoAreasStatus[area].mask ||
          (infoAreasStatus[area].error &&
            4 == infoAreasStatus[area].error.code) ||
          (mask = _.union(mask, infoAreasStatus[area].mask, [
            'infoAreasStatus.' + area + '.',
          ]));
      }),
        mask.length &&
          ((data = __parse(fulldata, mask)), handler.func(data, null));
    });
  }
  function __parse(data, mask) {
    if (!data || !_.isArray(mask)) return !1;
    var resObj = {};
    for (var index in mask) {
      var s_path = mask[index];
      _.has(data, s_path)
        ? (resObj[s_path] = data[s_path])
        : ('.' == _.last(s_path) && (s_path += '*'),
          __valueToMask(data, s_path, resObj));
    }
    return resObj;
  }
  function __valueToMask(inObj, s_path, outObj) {
    if (inObj) {
      var outObj = outObj || (_.isArray(inObj) ? [] : {}),
        a_path = s_path.split('.'),
        keys = [];
      if ('' == s_path) return;
      if ('*' == a_path[0]) {
        if (_.isEmpty(a_path[1]) && (_.isFunction(inObj) || !_.isObject(inObj)))
          return;
        keys = _.keys(inObj);
      } else keys.push(a_path[0]);
      for (var index in keys) {
        var key = keys[index],
          value = inObj[key];
        if (_.isFunction(value)) outObj[key] = _.after(value);
        else if (_.isArray(value) || _.isObject(value)) {
          var new_s_path =
            '*' == a_path[0] ? '*.*' : s_path.substring(a_path[0].length + 1);
          '' == new_s_path && _.isArray(value) && (new_s_path = '*.*'),
            (outObj[key] = __valueToMask(value, new_s_path, outObj[key]));
        } else {
          if ('*' != a_path[0] && '*' == a_path[1])
            return (outObj[a_path[0]] = void 0), outObj;
          outObj[key] = _.clone(value);
        }
      }
      return outObj;
    }
  }
  var devInfoModule = angular.module(regdep('devinfo'), []);
  devInfoModule.service('devinfo', [
    '$http',
    '$timeout',
    '$q',
    function($http, $timeout, $q) {
      var inject = { $http: $http, $timeout: $timeout, $q: $q },
        devinfo = new Devinfo(inject);
      return (
        devinfo.init({ need_auth: !0 }),
        (devinfo.skipAuth = new Devinfo(inject)),
        devinfo.skipAuth.init({ need_auth: !1 }),
        (devinfo.longTimeout = new Devinfo(inject)),
        devinfo.longTimeout.init({ need_auth: !0 }),
        (devinfo.suspendAll = function() {
          devinfo.suspend(),
            devinfo.skipAuth.suspend(),
            devinfo.longTimeout.suspend();
        }),
        (devinfo.resumeAll = function() {
          devinfo.resume(),
            devinfo.skipAuth.resume(),
            devinfo.longTimeout.resume();
        }),
        devinfo
      );
    },
  ]),
    (Devinfo.prototype.init = init),
    (Devinfo.prototype.once = once),
    (Devinfo.prototype.subscribe = subscribe),
    (Devinfo.prototype.onceAndSubscribe = onceAndSubscribe),
    (Devinfo.prototype.unsubscribe = unsubscribe),
    (Devinfo.prototype.suspend = suspend),
    (Devinfo.prototype.resume = resume);
})();
