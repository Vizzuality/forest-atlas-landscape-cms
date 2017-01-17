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

      // We "upgrade" the file input
      new App.View.FileInputView({
        el: '.js-file-input',
        label: 'Change file'
      });
    }
  });
})(this.App));
