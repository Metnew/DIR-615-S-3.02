!(function() {
  function n(n, r) {
    function t(n, t, u, e) {
      return i(n, u, r(t, u, e));
    }
    return o(n, t, {});
  }
  function r(n, r) {
    function t(n, t, u, e) {
      return r(t, u, e) ? i(n, u, t) : n;
    }
    return o(n, t, {});
  }
  function t(n, t) {
    return r(n, c(t));
  }
  function u(n, r) {
    function t(n, t, u, e) {
      return i(n[+!!r(t, u, e)], u, t), n;
    }
    return o(n, t, [{}, {}]);
  }
  function e(n) {
    return r(n, a);
  }
  function o(n, r, t) {
    var u = t;
    for (var e in n) u = r(u, n[e], e, n);
    return u;
  }
  function f(n) {
    return n
      ? Object.keys(n).map(function(r) {
          return n[r];
        })
      : [];
  }
  function i(n, r, t) {
    return (n[r] = t), n;
  }
  function c(n) {
    return function(r, t, u) {
      return !n.apply(null, arguments);
    };
  }
  function a(n) {
    return n;
  }
  var p = {
    map: n,
    filter: r,
    reject: t,
    partition: u,
    compact: e,
    reduce: o,
    toArray: f,
  };
  'undefined' != typeof module && 'undefined' != typeof module.exports
    ? (module.exports = p)
    : (window.funo = p);
})();
