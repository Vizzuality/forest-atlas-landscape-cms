((function (App) {
  'use strict';

  App.Router.AdminUrls = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      console.log('yeahhhh!');
      new App.View.UrlsView({ el: '.js-urls' });
    }
  });
})(this.App));
