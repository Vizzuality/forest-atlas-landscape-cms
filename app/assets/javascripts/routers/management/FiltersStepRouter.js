((function (App) {
  'use strict';

  App.Router.ManagementFiltersStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      var dashboardFiltersView = new App.View.DashboardFiltersView({
        el: '.js-filters'
      });

      $('.js-form').on('submit', function () {
        // When the view is rendered, a hidden field with the state of the filters is updated.
        // This way we make sure to have the latest changes.
        dashboardFiltersView.render();
      });
    }
  });
})(this.App));
