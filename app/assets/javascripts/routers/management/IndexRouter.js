((function (App) {
  'use strict';

  // DO NOT DELETE THIS ROUTER
  // It is used to instantiate (indirectly through the dispatcher)
  // the quick links component

  App.Router.ManagementIndex = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },
    index: function () {
    }

  });
})(this.App));
