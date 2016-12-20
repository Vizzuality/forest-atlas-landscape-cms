((function (App) {
  'use strict';

  App.View.ConnectorSelectorView = Backbone.View.extend({
    template: HandlebarsTemplates['management/connector-selector'],
    collection: new Backbone.Collection(),
    events: {
      'change .js-connector': '_onChangeConnector'
    },

    initialize: function (settings) {
      this._setSelection(settings.connectors);
      this.selected = settings.connectorSelected;
      this.render();
    },

    _setSelection: function (connectors) {
      this.collection = connectors;
    },

    _onChangeConnector: function (event) {
      var selected = event.target.value;
      this.selected = this.collection.find(function (item) { return item.connector === selected; });
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        connectors: this.collection,
        selected: this.selected
      }));
      this.setElement(this.el);
    }
  });
})(this.App));
