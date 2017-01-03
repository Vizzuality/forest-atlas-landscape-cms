((function (App) {
  'use strict';
  App.Router.ManagementConnectorStep = Backbone.Router.extend({
    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    /**
     * Get the list of connectors
     * @returns {{ connector: string, provider: string, type: string}[]}
     */
    _getConnectors: function () {
      return [
        { connector: 'cartodb', provider: 'cartodb', type: 'rest' },
        { connector: 'csv', provider: 'csv', type: 'document' },
        { connector: 'json', provider: 'rwjson', type: 'json' },
        { connector: 'arcgis', provider: 'featureservice', type: 'rest' }
      ];
    },

    index: function () {
      var datasetConnectorsView = new App.View.DatasetConnectorsView({
        el: '.js-connector',
        connectors: this._getConnectors(),
        connectorSelected: (window.gon && gon.connectorSelected) || null
      });

      $('.js-form').on('submit', function () {
        // When the view is rendered, a hidden field with the state of the filters is updated.
        // This way we make sure to have the latest changes.
        datasetConnectorsView.render();
      });
    }
  });
})(this.App));
