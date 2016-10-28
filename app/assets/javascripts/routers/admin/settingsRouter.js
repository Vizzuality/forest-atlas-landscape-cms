((function (App) {
  'use strict';

  App.Router.AdminSettings = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      new App.View.FlagColorsView({ el: '.js-flag-colors' });
    }
  });
})(this.App));
