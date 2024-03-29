'use strict';
!(function() {
  var cookies = angular.module(regdep('cookies'), []);
  cookies.service('cookie', function() {
    (this.is = function() {
      return navigator.cookieEnabled || 'cookie' in $document ? !0 : !1;
    }),
      (this.get = function(key) {
        if (!this.is()) return '';
        for (
          var cookies = (document.cookie && document.cookie.split(';')) || [],
            i = 0;
          i < cookies.length;
          i++
        ) {
          for (var thisCookie = cookies[i]; ' ' === thisCookie.charAt(0); )
            thisCookie = thisCookie.substring(1, thisCookie.length);
          if (0 === thisCookie.indexOf(key + '='))
            return decodeURIComponent(
              thisCookie.substring(key.length + 1, thisCookie.length)
            );
        }
        return '';
      }),
      (this.set = function(key, value, expires, measure) {
        var today;
        if (((today = new Date()), expires))
          switch (measure) {
            case 'sec':
              expires = 1e3 * expires;
              break;
            case 'min':
              expires = 1e3 * expires * 60;
              break;
            case 'hour':
              expires = 1e3 * expires * 3600;
              break;
            default:
              expires = 1e3 * expires * 3600 * 24;
          }
        document.cookie =
          key +
          '=' +
          encodeURIComponent(value) +
          (expires
            ? '; path = /; expires=' +
              new Date(today.getTime() + expires).toGMTString()
            : '');
      }),
      (this.remove = function(key) {
        this.set(key, '', -30);
      }),
      (this.deleteAll = function() {
        for (
          var thisCookie = null, cookies = document.cookie.split(';'), i = 0;
          i < cookies.length;
          i++
        ) {
          for (thisCookie = cookies[i]; ' ' === thisCookie.charAt(0); )
            thisCookie = thisCookie.substring(1, thisCookie.length);
          var key = thisCookie.substring(0, thisCookie.indexOf('='));
          this.remove(key);
        }
      });
  });
})();
