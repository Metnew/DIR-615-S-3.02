'use strict';
!(function() {
  function telnetUtil(somovd, funcs, constants) {
    function pull() {
      function success(response) {
        return (
          (data =
            response.data && response.data.telnet ? response.data.telnet : {}),
          Promise.resolve()
        );
      }
      return somovd.read(RPC).then(success);
    }
    function apply(input) {
      function success(response) {
        return funcs.is.allRPCSuccess(response)
          ? Promise.resolve()
          : void Promise.reject();
      }
      var saveData = { telnet: { enable: input.Enable, port: input.Port } };
      return somovd.write(152, saveData).then(success);
    }
    function getData() {
      return { Enable: data.enable || !1, Port: data.port || 23 };
    }
    function getSupported() {
      return { Port: !constants.bcm };
    }
    var RPC = 152,
      data = null;
    return {
      pull: pull,
      apply: apply,
      getData: getData,
      getSupported: getSupported,
    };
  }
  angular
    .module('app')
    .service('telnetUtil', ['somovd', 'funcs', 'telnetConstants', telnetUtil]);
})();
