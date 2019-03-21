((function (App) {
  'use strict';

  App.Router.ManagementTagSearchingStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.select = document.querySelector('.js-select');
    },

    index: function () {
      $(this.select).select2();
    }

  });
})(this.App));
