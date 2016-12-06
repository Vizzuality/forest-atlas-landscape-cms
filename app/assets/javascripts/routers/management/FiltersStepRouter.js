((function (App) {
  'use strict';

  App.Router.ManagementFiltersStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    /**
     * Return the fields used by the dashboardFiltersView
     * TODO: most of it needs to be removed when the back end returns
     * the correct values
     * @returns {object[]} fields
     */
    _getFields: function () {
      return (window.gon && gon.fields).map(function (field) {
        if (field.type === 'date') {
          field.min = new Date(field.min);
          field.max = new Date(field.max);

          // If the date couldn't be parsed, we just remove the field
          if (Number.isNaN(field.min.getTime()) || Number.isNaN(field.max.getTime())) {
            return null;
          }
        }

        return field;
      }).filter(function (field) {
        return !!field;
      });
    },

    index: function () {
      var dashboardFiltersView = new App.View.DashboardFiltersView({
        el: '.js-filters',
        fields: this._getFields(),
        endpointUrl: (window.gon && gon.filtersEndpointUrl) || null
      });

      $('.js-form').on('submit', function () {
        // When the view is rendered, a hidden field with the state of the filters is updated.
        // This way we make sure to have the latest changes.
        dashboardFiltersView.render();
      });
    }
  });
})(this.App));
