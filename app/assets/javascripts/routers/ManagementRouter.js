((function (App) {
  'use strict';

  App.Router.Management = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      console.info('You are at management page (index)');

      new App.View.ManagementView();
    }

  });
})(this.App));
