'use strict';
angular.module(regdep('check-factory'), []).service('checkFactory', [
  'devinfo',
  'ngDialog',
  'funcs',
  function(devinfo, ngDialog, funcs) {
    function handler(res) {
      res &&
        (res.factorySettings &&
          !ngDialog.isOpen(dialogID) &&
          (dialogID = ngDialog.open({
            template: 'dialogs/check_factory/dialog.tpl.html',
            className: 'check_factory_dialog',
            closeByDocument: !1,
            closeByEscape: !1,
            controller: 'CheckFactoryDialogCtrl',
            resolve: funcs.getLazyResolve(
              'dialogs/check_factory/ctrl.lazy.js',
              'CheckFactoryDialogCtrl'
            ),
            showClose: !1,
          }).id),
        !res.factorySettings &&
          ngDialog.isOpen(dialogID) &&
          ngDialog.close(dialogID));
    }
    var areas = 'notice',
      dialogID = null;
    (this.start = function() {
      return devinfo.skipAuth.subscribe(areas, handler);
    }),
      (this.stop = function() {
        return devinfo.skipAuth.unsubscribe(areas, handler);
      });
  },
]);
