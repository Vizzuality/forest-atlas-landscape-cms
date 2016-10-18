((function (App) {
  'use strict';

  App.Router.AdminUrls = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      new App.View.UrlsView({ el: '.js-urls' });
    }
  });
})(this.App));
