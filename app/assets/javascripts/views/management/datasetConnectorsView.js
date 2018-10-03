((function (App) {
  'use strict';

  App.View.DatasetConnectorsView = Backbone.View.extend({
    template: HandlebarsTemplates['management/dataset-connectors'],
    collection: new Backbone.Collection(),
    // Current selected connector
    selectedConnector: { connector: 'cartodb', provider: 'cartodb', type: 'rest', uploader: false },

    events: {
      'change .js-connector': '_onChangeConnector',
      'change .js-uploader': '_onChangeUploader'
    },

    defaults: {
      uploaderDisabled: true,
      fileUploader: null
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
        this.options.dataPathDisabled = false;
        this.options.uploaderDisabled = !model.attributes.uploader;
        if (this.options.uploaderDisabled) {
          this.options.fileUploader = null;
        }
        if (connector != 'json'){
          this.options.dataPathDisabled = true
        }
        this.render();
      }
    },

    /**
     * Events handler for when the uploader is changed
     */
    _onChangeUploader: function (e) {
      var uploader = e.target.value;
      switch (uploader) {
        case 'url':
          this.options.fileUploader = 'url';
          break;
        case 'file':
          this.options.fileUploader = 'file';
          break;
        default:
          this.options.fileUploader = null;
      }
      this.render();
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
        selected: this.options.selectedConnector,
        dataPathDisabled: this.options.dataPathDisabled,
        uploaderDisabled: this.options.uploaderDisabled,
        fileUploader: this.options.fileUploader
      }));

      this._enhanceSelectors();
    }
  });
})(this.App));
