((function (App) {
  'use strict';

  App.Router.ManagementIndex = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },
    index: function () {
      // We remove the site switcher container
      $('.js-site-switcher').remove();
    }

  });
})(this.App));
