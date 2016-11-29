((function (App) {
  'use strict';

  App.Router.ManagementPages = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      // We initialize the site switcher
      new App.View.SiteSwitcherView({
        el: $('.js-site-switcher'),
        slug: this.slug
      });
    }
  });
})(this.App));
