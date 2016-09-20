((function (App) {
  'use strict';

  // LEGACY CODE
  // To be removed when the admin section is updated to the architecture of the rest
  // of the app

  App.Router.Admin = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      console.info('You are at admin page');

      new App.View.AdminView();
    }

  });
})(this.App));
