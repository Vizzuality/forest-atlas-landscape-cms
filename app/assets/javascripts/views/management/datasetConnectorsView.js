((function (App) {
  'use strict';

  App.View.DatasetConnectorsView = Backbone.View.extend({
    template: HandlebarsTemplates['management/dataset-connectors'],
    collection: new Backbone.Collection(),
    // Current selected connector
    selectedConnector: { connector: 'cartodb', provider: 'cartodb', type: 'rest' },

    events: {
      'change .js-connector': '_onChangeConnector'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.options.collection = new Backbone.Collection(settings.connectors);
      this.render();
    },

    /**
     * Events handler for when the connector type is changed
     * @param {Event} e - event
     */
    _onChangeConnector: function (e) {
      var connector = e.target.value;
      var model = this.options.collection.findWhere({ connector: connector });
      if (model) {
        this.options.selectedConnector = model.attributes;
        this.render();
      }
    },

    /**
     * Enhance the selectors by initialising Select2 on the selects
     */
    _enhanceSelectors: function () {
      this.$el.find('select').select2({
        width: 'off' // Auto width
      });
    },

    render: function () {
      this.$el.html(this.template({
        connectors: this.options.collection.toJSON(),
        selected: this.options.selectedConnector
      }));

      this._enhanceSelectors();
    }
  });
})(this.App));
