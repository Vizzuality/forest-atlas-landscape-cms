((function (App) {
  'use strict';

  App.Router.ManagementVisualizationStep = Backbone.Router.extend({

    state: {
      chart: {
        type: null,
        x: null,
        y: null
      }
    },

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      this._initChart();
      this._setListeners();

      this.chart.render();
    },

    /**
     * Set the listeners that don't depend on a DOM element
     */
    _setListeners: function () {
      this.listenTo(this.chart, 'state:change', function (state) {
        this._saveState(state);
      });
    },

    /**
     * Save the state of the chart into a global state object
     * @param {object} state - state to save
     */
    _saveState: function (state) {
      this.state.chart = Object.assign({}, this.state.chart, state);
      this._updateHiddenFields();
    },

    /**
     * Update the hidden fields so when the user submits the form, the back end saves
     * the configuration
     */
    _updateHiddenFields: function () {
      this.chartInput = document.querySelector('.js-chart-input');
      this.chartInput.value = JSON.stringify(this.state.chart);
    },

    /**
     * Return the dataset
     * @returns {object[]} dataset
     */
    _getDataset: function () {
      return (window.gon && gon.data.data) || [];
    },

    /**
     * Retrieve the chart
     * @returns {object[]} charts
     */
    _getChart: function () {
      try {
        return (window.gon && gon.visualization && JSON.parse(gon.visualization)) || {};
      } catch (e) {
        return {};
      }
    },

    /**
     * Init the chart
     */
    _initChart: function () {
      var dataset = this._getDataset();
      var chart = this._getChart();

      this.chart = new App.View.ChartWidgetView({
        el: document.querySelector('.js-chart'),
        data: dataset,
        chart: chart.chart || null,
        columnX: chart.x || null,
        columnY: chart.y || null
      });
    }

  });
})(this.App));
