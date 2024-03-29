'use strict';
!(function() {
  var tools = angular.module(regdep('url-parser'), []);
  tools.constant(
    'queryString',
    (function(a) {
      if ('' == a) return {};
      for (var b = {}, i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        2 == p.length &&
          (b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' ')));
      }
      return b;
    })(window.location.search.substr(1).split('&'))
  );
})();
