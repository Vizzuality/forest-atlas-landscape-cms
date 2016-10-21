((function (App) {
  'use strict';

  App.Router.FrontMap = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function () {
      // We force the body to use the full width
      document.querySelector('body').classList.add('-wide');

      // Instantiate the common views here for the page, use the "routes" object to instantiate
      // per route views
      new App.View.HeaderView({
        el: document.querySelector('.js-header')
      });
    },

    index: function () {

    }

  });
})(this.App));
