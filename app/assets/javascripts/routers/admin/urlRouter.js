((function (App) {

  'use strict';

  App.Router.AdminSettings = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      new App.View.UrlsView({ el: '.js-urls' });
    }
  });
})(this.App));
