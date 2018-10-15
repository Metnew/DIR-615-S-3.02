!(function() {
  function _checkBrowser(
    supported,
    badBrowserLink,
    oldBrowserLink,
    originLink
  ) {
    function redirect(url) {
      var separator = url.indexOf('?') >= -1 ? '&' : '?';
      document.location.href =
        url + separator + 'lang=' + detectLang() + '&origin=' + originLink;
    }
    function detectLang() {
      var langs = {
          ru: 'rus',
          en: 'eng',
          uk: 'ukr',
          tr: 'tur',
          fr: 'fra',
          ar: 'ara',
          fa: 'fas',
        },
        browserLang = navigator.language || navigator.userLanguage;
      return (
        (browserLang = browserLang.toLowerCase().substr(0, 2)),
        browserLang in langs ? langs[browserLang] : 'eng'
      );
    }
    var ua = detect.parse(navigator.userAgent),
      browser = ua.browser.family,
      version = ua.browser.major,
      isBadBrowser = !(browser in supported),
      isOldBrowser = version < supported[browser],
      url = isBadBrowser
        ? badBrowserLink
        : isOldBrowser
          ? oldBrowserLink
          : null;
    return url ? redirect(url) : !0;
  }
  function checkBrowser() {
    function getCookie(name) {
      var matches = document.cookie.match(
        new RegExp(
          '(?:^|; )' +
            name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
            '=([^;]*)'
        )
      );
      return matches ? decodeURIComponent(matches[1]) : void 0;
    }
    var supported = {
        IE: 10,
        Edge: 0,
        Chrome: 48,
        'Chrome Mobile': 48,
        Chromium: 48,
        Firefox: 44,
        'Firefox Mobile': 44,
        Safari: 8,
        'Mobile Safari': 8,
        Opera: 35,
      },
      badUrl = '/check_browser?error=bad',
      oldUrl = '/check_browser?error=old',
      originUrl = encodeURIComponent(location.href);
    getCookie('skip_browser_check') ||
      _checkBrowser(supported, badUrl, oldUrl, originUrl);
  }
  checkBrowser();
})();
