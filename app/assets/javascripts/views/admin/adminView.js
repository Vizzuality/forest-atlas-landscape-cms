((function (App) {
  'use strict';

  // LEGACY CODE
  // To be removed when the admin section is updated to the architecture of the rest
  // of the app

  App.View.AdminView = Backbone.View.extend({

    initialize: function () {
      console.info('adminview initialized');
    }

  });
})(this.App));
