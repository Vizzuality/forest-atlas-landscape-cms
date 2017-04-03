((function (App) {
  'use strict';
  var TableCollection = Backbone.Collection.extend({
    parse: function (data) {
      var keys;
      if (data.length) keys = Object.keys(data[0]);
      return data.map(function (row) {
        var res = {};
        res.row = keys.map(function (key) {
          return {
            name: key,
            value: row[key],
            sortable: true
          };
        });
        return res;
      });
    }
  });
  App.Router.ManagementPreviewStep = Backbone.Router.extend({
    state: {
      name: 'Untitled',
      config: {
        widgets: [
          // Structure of a map widget
          // {
          //   type: 'map',
          //   lat: null,
          //   lng: null,
          //   zoom: null
          // },
          // Structure of a chart widget
          // {
          //   type: 'chart',
          //   chart: null,
          //   x: null,
          //   y: null
          // }
        ]
      }
    },
    defaults: {
      // Number of widgets of the dashboard
      widgetsCount: 3
    },
    routes: {
      '(/)': 'index'
    },
    initialize: function (params) {
      this.slug = params[0] || null;
    },
    index: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this._initDescription();
      this._initWidgets();
      this._initTable();
      this._setListeners();
      this._renderWidgets();
    },
    /**
     * Set the listeners that don't depend on a DOM element
     */
    _setListeners: function () {
      if (!this.widgetsStateHandler) {
        this.widgetsStateHandler = Array(3).fill(null).map(function (value, index) {
          return function (state) {
            this._saveState('widget' + index, state);
          }.bind(this);
        }, this);
      }
      for (var i = 0, j = this.options.widgetsCount; i < j; i++) {
        this.listenTo(this['widget' + i], 'state:change', this.widgetsStateHandler[i]);
      }
    },
    /**
     * Remove the listeners that don't depend on a DOM element
     */
    _removeListeners: function () {
      if (!this.widgetsStateHandler) return;
      for (var i = 0, j = this.options.widgetsCount; i < j; i++) {
        this.stopListening(this['widget' + i], 'state:change', this.widgetsStateHandler[i]);
      }
    },
    /**
     * Init the description's "Read more" button
     */
    _initDescription: function () {
      var readModeBtn = document.querySelector('.js-read-more');
      if (readModeBtn) readModeBtn.addEventListener('click', this._openDescriptionModal.bind(this));
    },
    /**
     * Open the description modal
     */
    _openDescriptionModal: function () {
      if (!this.descriptionModal) {
        var description = document.querySelector('.js-description');
        this.descriptionModal = new App.View.ModalView();
        var descriptionDashboardModalView = new App.View.DescriptionDashboardModalView({
          name: (window.gon && gon.pageName) || null,
          description: description.innerHTML,
          closeCallback: function () {
            this.descriptionModal.close();
          }.bind(this)
        });
        this.descriptionModal.render = descriptionDashboardModalView.render;
      }
      this.descriptionModal.open();
    },
    /**
     * Return the table collection corresponding to the dataset
     * @returns {object[]}
     */
    _getTableCollection: function () {
      return new TableCollection(this._getDataset(), { parse: true });
    },
    /**
     * Init the table
     */
    _initTable: function () {
      this.table = new App.View.TableView({
        el: document.querySelector('.js-table'),
        collection: this._getTableCollection(),
        tableName: 'Dashboard data'
      });
    },
    /**
     * Save the state of the specified component into a global state object
     * @param {string} component - "filters", "chart1", "chart2" or "map"
     * @param {object} state - state to save
     */
    _saveState: function (component, state) {
      var index = +component.slice(-1);
      this.state.config.widgets[index] = Object.assign({}, this.state.config.widgets[index], state);
      this._updateHiddenFields();
    },
    /**
     * Update the hidden fields so when the user submits the form, the back end saves
     * the configuration
     */
    _updateHiddenFields: function () {
      if (!this.widgetsInput) {
        this.widgetsInput = document.querySelector('.js-widgets-input');
      }
      this.widgetsInput.value = JSON.stringify(this.state.config.widgets);
    },
    /**
     * Return the dataset
     * @returns {object[]} dataset
     */
    _getDataset: function () {
      return (window.gon && gon.analysisData.data) || [];
    },
    /**
     * Retrieve the list of widgets
     * @returns {object[]} widgets
     */
    _getDashboardWidgets: function () {
      var widgets = [];
      if (gon && gon.analysisWidgets) {
        widgets = gon.analysisWidgets.map(function (widget) {
          if (widget.type === 'chart') {
            return {
              type: 'chart',
              chart: widget.chart || null,
              x: widget.x || null,
              y: widget.y || null,
              xLabel: widget.xLabel,
              yLabel: widget.yLabel
            };
          } else if (widget.type === 'map') {
            return {
              type: 'map',
              lat: widget.lat || 0,
              lng: widget.lng || 0,
              zoom: widget.zoom || 3
            };
          }
        });
      } else {
        for (var i = 0, j = this.options.widgetsCount - 1; i < j; i++) {
          widgets.push({ type: 'chart', chart: null, x: null, y: null });
        }
        widgets.unshift({ type: 'map', lat: 0, lng: 0, zoom: 3 })
      }
      return widgets;
    },
    /**
     * Init the widgets
     *
     */
    _initWidgets: function () {
      var dataset = this._getDataset();
      var widgets = this._getDashboardWidgets();
      widgets.forEach(function (widget, index) {
        if (widget.type === 'map') {
          this['widget' + index] = new App.View.MapWidgetView({
            el: document.querySelector('.js-widget-' + (index + 1)),
            data: dataset,
            // TODO
            // Once gon is updated, we should retrieve the real names of the fields used to position
            // the dots
            fields: {
              lat: 'latitude' || null,
              lng: 'longitude' || null
            },
            center: [widget.lat, widget.lng],
            zoom: widget.zoom,
            switchCallback: function () {
              this._switchWidget(index, 'chart');
            }.bind(this)
          });
        } else {
          this['widget' + index] = new App.View.ChartWidgetView({
            el: document.querySelector('.js-widget-' + (index + 1)),
            data: dataset,
            chart: widget.chart,
            columnX: widget.x,
            columnY: widget.y,
            switchCallback: function () {
              this._switchWidget(index, 'map');
            }.bind(this),
            changeLabelsCallback: function () {
              this._changeLabels(index);
            }.bind(this)
          });
        }
      }, this);
    },
    /**
     * Render the widgets
     */
    _renderWidgets: function () {
      for (var i = 0, j = this.options.widgetsCount; i < j; i++) {
        if (this['widget' + i]) this['widget' + i].render();
      }
    },
    /**
     * Change the custom labels of the widget axis
     * @param {number} index
     */
    _changeLabels: function (index) {
      this.state.config.widgets[index].xLabel = this['widget' + index].options.xLabel;
      this.state.config.widgets[index].yLabel = this['widget' + index].options.yLabel;
      this._updateHiddenFields();
    },
    /**
     * Switch the widget designated by its index for the widget of the specified type
     * @param {number} index
     * @param {string} type ('map' or 'chart')
     */
    _switchWidget: function (index, type) {
      var instance = this['widget' + index];
      var widgetContainer = instance.el;
      // We remove the DOM changes implied by the widget's intance
      instance.remove();
      // We instanciate the new widget
      var dataset = this._getDataset();
      // We remove all the listeners
      this._removeListeners();
      if (type === 'chart') {
        this['widget' + index] = new App.View.ChartWidgetView({
          el: widgetContainer,
          data: dataset,
          switchCallback: function () {
            this._switchWidget(index, 'map');
          }.bind(this),
          changeLabelsCallback: function () {
            this._changeLabels(index);
          }.bind(this)
        });
      } else {
        this['widget' + index] = new App.View.MapWidgetView({
          el: widgetContainer,
          data: dataset,
          // TODO
          // Once gon is updated, we should retrieve the real names of the fields used to position
          // the dots
          fields: {
            lat: 'latitude' || null,
            lng: 'longitude' || null
          },
          switchCallback: function () {
            this._switchWidget(index, 'chart');
          }.bind(this)
        });
      }
      // We re-set the listeners
      this._setListeners();
      this['widget' + index].render();
    }
  });
})(this.App));
