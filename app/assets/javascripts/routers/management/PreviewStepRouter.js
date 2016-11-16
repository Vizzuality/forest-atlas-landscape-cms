((function (App) {
  'use strict';

  App.Router.ManagementPreviewStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
    }

  });
})(this.App));
