'use strict';
!(function() {
  function authDigestProvider($httpProvider) {
    function $get($injector) {
      var helper = $injector.get('authDigestHelper'),
        realmStorage = $injector.get('authDigestRealmStorage'),
        credentialsStorage = $injector.get('authDigestCredentialsStorage');
      return {
        setCredentials: setCredentials(helper, credentialsStorage),
        cleanCredentials: cleanAuthorizationCredentials(
          realmStorage,
          credentialsStorage
        ),
      };
    }
    function setCredentials(helper, credentialsStorage) {
      return function(credentials, authHeader) {
        var newCredentials = {
          username: credentials.username,
          realm: authHeader.realm,
          qop: authHeader.qop,
          nonce: authHeader.nonce,
          ha1: helper.generateHA1(
            credentials.username,
            credentials.password,
            authHeader.realm
          ),
        };
        credentialsStorage.set(authHeader.realm, newCredentials);
      };
    }
    function cleanAuthorizationCredentials(realmStorage, credentialsStorage) {
      return function(currentOnly) {
        if (currentOnly) {
          var realm = realmStorage.getCurrent();
          credentialsStorage.remove(realm);
        } else credentialsStorage.removeAll();
      };
    }
    var providerObj = {
        authHeaderName: null,
        autologinHeaderName: null,
        repeatRequestHeaderName: null,
        deviceSessionHeaderName: null,
        authDefaultUsername: null,
        authDefaultPassword: null,
        getCredentialsCallback: null,
        $get: $get,
      },
      httpInterceptiors = [
        '$rootScope',
        '$q',
        '$injector',
        function($rootScope, $q, $injector) {
          function reAuthorization(credentials, authHeader) {
            setCredentials(helper, credentialsStorage)(credentials, authHeader),
              (response401 = !1),
              requestService.retryAll();
          }
          function updateDeviceSessionHeader(headers) {
            headers[providerObj.deviceSessionHeaderName] &&
              localStorage.set(
                providerObj.deviceSessionHeaderName,
                headers[providerObj.deviceSessionHeaderName]
              );
          }
          var helper = $injector.get('authDigestHelper'),
            headerService = $injector.get('authDigestHeader'),
            requestService = $injector.get('authDigestRequest'),
            realmStorage = $injector.get('authDigestRealmStorage'),
            credentialsStorage = $injector.get('authDigestCredentialsStorage'),
            localStorage = $injector.get('localStorageService'),
            response401 = !1,
            request = function(config) {
              var realm = realmStorage.getCurrent(),
                credentials = credentialsStorage.get(realm);
              if (
                realm &&
                credentials &&
                credentials.username &&
                credentials.ha1 &&
                credentials.nonce &&
                credentials.qop
              ) {
                (credentials.nc = helper.getNc()),
                  (credentials.cnonce = helper.generateNonce(16)),
                  (credentials.response = helper.generateResponse(
                    config,
                    credentials
                  ));
                var authHeader = headerService.generate(config, credentials);
                authHeader && (config.headers.Authorization = authHeader),
                  localStorage.get(providerObj.deviceSessionHeaderName) &&
                    (config.headers[
                      providerObj.deviceSessionHeaderName
                    ] = localStorage.get(providerObj.deviceSessionHeaderName));
              }
              return config;
            },
            responseError = function(res) {
              if (401 == res.status) {
                var deferredAuthError = $q.defer(),
                  config = res.config,
                  headers = res.headers();
                if (
                  ((config.headers[providerObj.repeatRequestHeaderName] = !0),
                  requestService.append(config, deferredAuthError),
                  $rootScope.$emit('request.not_authorized', res),
                  !response401)
                ) {
                  response401 = !0;
                  var authHeader = headerService.parse(
                      headers[providerObj.authHeaderName]
                    ),
                    autologinAvailable =
                      headers[providerObj.autologinHeaderName];
                  if (
                    realmStorage.isPrevent(authHeader.realm) &&
                    credentialsStorage.get(authHeader.realm)
                  )
                    return (
                      realmStorage.set(authHeader.realm),
                      (response401 = !1),
                      requestService.retryAll(),
                      deferredAuthError.promise
                    );
                  if (
                    (realmStorage.isCurrent(authHeader.realm) ||
                      realmStorage.set(authHeader.realm),
                    cleanAuthorizationCredentials(
                      realmStorage,
                      credentialsStorage
                    )(!0),
                    autologinAvailable)
                  ) {
                    var credentials = {
                      username: providerObj.authDefaultUsername,
                      password: providerObj.authDefaultPassword,
                    };
                    updateDeviceSessionHeader(headers),
                      reAuthorization(credentials, authHeader);
                  } else
                    $injector
                      .invoke(providerObj.getCredentialsCallback, null, {
                        authParams: headerService.getAnwebParams(headers),
                      })
                      .then(function(credentials) {
                        updateDeviceSessionHeader(headers),
                          reAuthorization(credentials, authHeader);
                      });
                }
                return deferredAuthError.promise;
              }
              return $q.reject(res);
            },
            response = function(res) {
              var headers = res.headers(),
                headerName = providerObj.deviceSessionHeaderName,
                headerValue = localStorage.get(headerName);
              return (
                !headerValue &&
                  headers[headerName] &&
                  localStorage.set(headerName, headers[headerName]),
                res
              );
            };
          return {
            request: request,
            response: response,
            responseError: responseError,
          };
        },
      ];
    return $httpProvider.interceptors.push(httpInterceptiors), providerObj;
  }
  function authDigestRequest($injector) {
    function retryHttpRequest(config, deferred) {
      function successCallback(response) {
        deferred.resolve(response);
      }
      function errorCallback(response) {
        deferred.reject(response);
      }
      var $http = $injector.get('$http');
      return $http(config).then(successCallback, errorCallback);
    }
    var MAX_REQUESTS_LEN = 10,
      requests = [],
      append = function(config, deferred) {
        requests.length == MAX_REQUESTS_LEN && requests.splice(0, 1),
          requests.push({ config: config, deferred: deferred });
      },
      retryAll = function() {
        angular.forEach(requests, function(req) {
          retryHttpRequest(req.config, req.deferred);
        }),
          (requests.length = 0);
      };
    return { append: append, retryAll: retryAll };
  }
  function authDigestHeader() {
    var generate = function(config, params) {
        var header = 'Digest ';
        return (
          params.algorithm &&
            (header += 'algorithm="' + params.algorithm + '", '),
          params.opaque &&
            (header += 'opaque="' + (params.opaque || '') + '", '),
          (header +=
            'username="' +
            encodeURIComponent(params.username) +
            '", realm="' +
            params.realm +
            '", nonce="' +
            params.nonce +
            '", uri="' +
            config.url +
            '", response="' +
            params.response +
            '", qop=' +
            params.qop +
            ', nc=' +
            params.nc +
            ', cnonce="' +
            params.cnonce +
            '"')
        );
      },
      parse = function(header) {
        if (!header) return null;
        for (
          var str = header.replace(/\s*Digest\s+/, ''),
            arr = str.split(','),
            params = {},
            i = 0;
          i < arr.length;
          i++
        ) {
          var re = /\s*(\w+)\s*=\s*"*(\w+)"*\s*/,
            pair = arr[i].match(re);
          if (pair && 3 == pair.length) {
            var name = pair[1],
              value = pair[2];
            switch (name) {
              case 'username':
              case 'realm':
              case 'nonce':
              case 'response':
              case 'uri':
              case 'qop':
              case 'nc':
              case 'cnonce':
                params[name] = value;
            }
          }
        }
        return params;
      },
      getAnwebParams = function(headers) {
        var params = {};
        return (
          (params.clientTryCount = angular.isDefined(
            headers['anweb-auth-try-count']
          )
            ? headers['anweb-auth-try-count']
            : 0),
          angular.isDefined(headers['anweb-auth-try-count-remain']) &&
            (params.tryCountRemain = headers['anweb-auth-try-count-remain']),
          angular.isDefined(headers['anweb-auth-ban-time-remain']) &&
            (params.banTimeRemain = headers['anweb-auth-ban-time-remain']),
          angular.isDefined(headers['anweb-auth-ban-reason']) &&
            (params.banReason = headers['anweb-auth-ban-reason']),
          angular.isDefined(headers['anweb-not-authorized']) &&
            (params.notAuthorized = headers['anweb-not-authorized']),
          params
        );
      };
    return { generate: generate, parse: parse, getAnwebParams: getAnwebParams };
  }
  function authDigestRealmStorage(storage) {
    var maps = {
        current: 'auth-digest-current-realm',
        prevent: 'auth-digest-prevent-realm',
        preventList: 'auth-digest-prevent-list-realm',
      },
      getCurrent = function() {
        var current = storage.getParam(maps.current);
        return current ? current : null;
      },
      getPrevent = function() {
        var prevent = storage.getParam(maps.prevent);
        return prevent ? prevent : null;
      },
      isCurrent = function(name) {
        var current = storage.getParam(maps.current);
        return current == name;
      },
      isPrevent = function(name) {
        var preventList = (storage.getParam(maps.prevent),
        storage.getParam(maps.preventList) || []);
        return _.contains(preventList, name);
      },
      set = function(realm) {
        var current = storage.getParam(maps.current),
          prevent = storage.getParam(maps.prevent),
          preventList = storage.getParam(maps.preventList) || [];
        current && (prevent = angular.copy(current)),
          (current = realm),
          (preventList = _.without(preventList, realm)),
          preventList.unshift(prevent),
          storage.setParam(maps.current, current),
          storage.setParam(maps.prevent, prevent),
          storage.setParam(maps.preventList, preventList);
      },
      remove = function() {
        storage.removeParam(maps.current), storage.removeParam(maps.prevent);
      };
    return {
      getCurrent: getCurrent,
      getPrevent: getPrevent,
      isCurrent: isCurrent,
      isPrevent: isPrevent,
      set: set,
      remove: remove,
    };
  }
  function authDigestCredentialsStorage(storage) {
    var name = 'auth-digest-credentials',
      init = function() {
        storage.setParam(name, {});
      },
      isInit = function() {
        return !!storage.getParam(name);
      },
      getCredentials = function(realm) {
        isInit() || init();
        var credentials = storage.getParam(name);
        return credentials[realm] ? credentials[realm] : null;
      },
      setCredentials = function(realm, params) {
        isInit() || init();
        var credentials = storage.getParam(name);
        credentials[realm] || (credentials[realm] = {}),
          (credentials[realm] = angular.extend(credentials[realm], params)),
          storage.setParam(name, credentials);
      },
      removeCredentials = function(realm) {
        if (isInit()) {
          var credentials = storage.getParam(name);
          delete credentials[realm], storage.setParam(name, credentials);
        }
      },
      removeAllCredentials = function() {
        storage.removeParam(name);
      };
    return {
      get: getCredentials,
      set: setCredentials,
      remove: removeCredentials,
      removeAll: removeAllCredentials,
    };
  }
  function authDigestStorage(localStorageService) {
    function getParam(param) {
      return localStorageService.get(param);
    }
    function setParam(param, value) {
      localStorageService.set(param, value);
    }
    function removeParam(param) {
      localStorageService.remove(param);
    }
    var name = 'auth-digest',
      init = function() {
        setParam(name, JSON.stringify({}));
      },
      isInit = function() {
        return !!getParam(name);
      },
      getStorage = function() {
        isInit() || init();
        var result = getParam(name);
        return JSON.parse(result);
      },
      setStorage = function(storage) {
        isInit() || init(), setParam(name, JSON.stringify(storage));
      },
      removeStorage = function() {
        removeParam(name);
      },
      getStorageParam = function(param) {
        var storage = getStorage();
        return storage[param] ? storage[param] : null;
      },
      setStorageParam = function(param, data) {
        var storage = getStorage();
        (storage[param] = data), setStorage(storage);
      },
      removeStorageParam = function(param) {
        var storage = getStorage();
        delete storage[param], setStorage(storage);
      };
    return {
      get: getStorage,
      set: setStorage,
      remove: removeStorage,
      getParam: getStorageParam,
      setParam: setStorageParam,
      removeParam: removeStorageParam,
    };
  }
  function authDigestHelper(md5, $injector) {
    var _nc = 0,
      _chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      getNc = function() {
        _nc++;
        for (
          var zeros = 8 - _nc.toString().length, nc = '', i = 0;
          zeros > i;
          i++
        )
          nc += '0';
        return nc + _nc;
      },
      generateNonce = function(length) {
        for (
          var nonce = [], charsLength = _chars.length, i = 0;
          length > i;
          ++i
        )
          nonce.push(_chars[(Math.random() * charsLength) | 0]);
        return nonce.join('');
      },
      generateHA1 = function(username, password, realm) {
        return md5.createHash(username + ':' + realm + ':' + password);
      },
      generateResponse = function(config, credentials) {
        var ha1 = credentials.ha1,
          ha2 = md5.createHash(config.method + ':' + config.url);
        return md5.createHash(
          ha1 +
            ':' +
            credentials.nonce +
            ':' +
            credentials.nc +
            ':' +
            credentials.cnonce +
            ':' +
            credentials.qop +
            ':' +
            ha2
        );
      },
      generateHeader = function(config) {
        var realmStorage = $injector.get('authDigestRealmStorage'),
          credentialsStorage = $injector.get('authDigestCredentialsStorage'),
          headerService = $injector.get('authDigestHeader'),
          realm = realmStorage.getCurrent(),
          credentials = credentialsStorage.get(realm);
        return realm &&
          credentials &&
          credentials.username &&
          credentials.ha1 &&
          credentials.nonce &&
          credentials.qop
          ? ((credentials.nc = getNc()),
            (credentials.cnonce = generateNonce(16)),
            (credentials.response = generateResponse(config, credentials)),
            headerService.generate(config, credentials))
          : void 0;
      };
    return {
      getNc: getNc,
      generateNonce: generateNonce,
      generateHA1: generateHA1,
      generateResponse: generateResponse,
      generateHeader: generateHeader,
    };
  }
  var authDigest = angular.module(regdep('auth-digest'), [
    'angular-md5',
    'LocalStorageModule',
  ]);
  authDigest.provider('authDigest', ['$httpProvider', authDigestProvider]),
    authDigest.factory('authDigestRequest', ['$injector', authDigestRequest]),
    authDigest.factory('authDigestHeader', [authDigestHeader]),
    authDigest.factory('authDigestRealmStorage', [
      'authDigestStorage',
      authDigestRealmStorage,
    ]),
    authDigest.factory('authDigestCredentialsStorage', [
      'authDigestStorage',
      authDigestCredentialsStorage,
    ]),
    authDigest.factory('authDigestStorage', [
      'localStorageService',
      authDigestStorage,
    ]),
    authDigest.factory('authDigestHelper', [
      'md5',
      '$injector',
      authDigestHelper,
    ]);
})();
