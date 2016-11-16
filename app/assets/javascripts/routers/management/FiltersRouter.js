((function (App) {
  'use strict';

  App.Router.ManagementFiltersRouter = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      new App.View.FilterView({
        el: '.js-filters'
      });
    }
  });
})(this.App));
