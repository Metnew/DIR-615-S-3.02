'use strict';
function regdep(modname) {
  return _.contains(window.appDeps, modname)
    ? modname
    : (window.appDeps.push(modname), modname);
}
window.appDeps = [];
