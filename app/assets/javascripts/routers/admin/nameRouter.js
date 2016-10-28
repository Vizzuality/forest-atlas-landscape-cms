((function (App) {
  'use strict';

  App.Router.AdminName = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
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
    }
  });
})(this.App));
