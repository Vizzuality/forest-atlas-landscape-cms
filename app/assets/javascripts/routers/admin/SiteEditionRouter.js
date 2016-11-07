((function (App) {
  'use strict';

  App.Router.AdminSiteEdition = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.siteSlug = params[0] || null;
      this.step = (params.length > 1 && params[1]) || null;
    },

    index: function () {
      // We execute the code specific to the step
      if (this.step && this.step.length) {
        var stepMethod = 'init' + this.step[0].toUpperCase() + this.step.slice(1, this.step.length) + 'Step';
        if (this[stepMethod]) this[stepMethod]();
      }

      // We want the hidden continue button of the form clicked when the user clicks the one from the action-bar
      var continueButton = document.querySelector('.js-continue');
      var hiddenContinueButton = document.querySelector('.js-continue-original');

      continueButton.addEventListener('click', function (e) {
        e.preventDefault();
        hiddenContinueButton.click();
      });

      // We also want the same behaviour for the save button
      var saveButton = document.querySelector('.js-save');
      var hiddenSaveButton = document.querySelector('.js-save-original');

      saveButton.addEventListener('click', function (e) {
        e.preventDefault();
        hiddenSaveButton.click();
      });
    },

    initNameStep: function () {
      var formattedUrls = (window.gon && window.gon.global) ? gon.global.urlArray : [];
      formattedUrls = formattedUrls.map(function (url) {
        return {
          url: url.host,
          id: url.id
        };
      });

      new App.View.UrlsInputView({
        el: '.js-urls',
        collection: new Backbone.Collection(formattedUrls)
      });
    },

    initSettingsStep: function () {
      new App.View.FlagColorsView({ el: '.js-flag-colors' });
    }
  });
})(this.App));
