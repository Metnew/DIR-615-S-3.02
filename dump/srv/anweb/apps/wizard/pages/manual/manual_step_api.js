'use strict';
!(function() {
  function manualStepApiProvider() {
    function getApi() {
      return apiContainer ? apiContainer : (apiContainer = new ApiContainer());
    }
    function cleanApi() {
      apiContainer && apiContainer.destroy(), (apiContainer = null);
    }
    var apiContainer = null;
    return { get: getApi, clean: cleanApi };
  }
  function ApiContainer() {
    this.stepsApi = {};
  }
  function StepApi(params) {
    (this.name = params.name),
      (this.leaveHandler = params.onLeave),
      (this.activateHandler = params.onActivate);
  }
  angular
    .module('wizard')
    .factory('manualStepApiDispatcher', manualStepApiProvider),
    (manualStepApiProvider.$inject = []),
    _.extend(ApiContainer.prototype, {
      registerStepApi: function(params) {
        if (!this.stepsApi[params.name]) {
          var api = new StepApi(params);
          this.stepsApi[params.name] = api;
        }
      },
      getStepApi: function(stepName) {
        return this.stepsApi[stepName];
      },
      setCurrentStepApi: function(stepName) {
        this.currentStep && this.currentStep.leave(),
          (this.currentStep = this.stepsApi[stepName]),
          this.currentStep && this.currentStep.activate();
      },
      destroy: function() {
        this.currentStep && this.currentStep.leave(),
          (this.currentStep = null),
          (this.stepsApi = {});
      },
    }),
    _.extend(StepApi.prototype, {
      _tryCall: function(cb) {
        _.isFunction(cb) && cb();
      },
      activate: function() {
        this.onActivate();
      },
      onActivate: function(cb) {
        this._tryCall(this.activateHandler);
      },
      leave: function() {
        this.onLeave(this.leaveHandler);
      },
      onLeave: function(cb) {
        this._tryCall(cb);
      },
    });
})();
