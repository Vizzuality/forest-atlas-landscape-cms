((function (App) {
  'use strict';

  App.View.DashboardChartView = Backbone.View.extend({

    template: HandlebarsTemplates['front/dashboard-chart'],

    defaults: {
      // JSON spec file representing the vega chart
      json: null,
      // Ratio between the height and the width (i.e. height = chartRatio * width)
      chartRatio: 0.6,
      // Inner width of the chart, used internally
      _width: null,
      // Inner height of the chart, used internally
      _height: null
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this._setListeners();
      this.render();
    },

    /**
     * Set the listeners that doesn't depend on a DOM node
     */
    _setListeners: function () {
      window.addEventListener('resize', _.debounce(this._onResize.bind(this), 150));
    },

    /**
     * Event handler for when the window is resized
     */
    _onResize: function () {
      if (!this.chart) return;

      /* eslint-disable no-underscore-dangle */
      var previousWidth = this.options._width;
      var previousHeight = this.options._height;
      /* eslint-enable no-underscore-dangle */

      var newDimensions = this._computeChartDimensions();
      if (newDimensions.width !== previousWidth || newDimensions.height !== previousHeight) {
        this._renderChart();
      }
    },

    /**
     * Compute the chart dimensions
     * @returns {object} { width, height }
     */
    _computeChartDimensions: function () {
      var containerDimensions = this.chartContainer.getBoundingClientRect();
      var padding = Object.assign({}, this.options.json.padding, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      });

      var width = containerDimensions.width - padding.left - padding.right;
      var height = width * this.options.chartRatio;

      // We save the current dimensions of the chart to diff them whenever the window is resized in order to minimize
      // the number of re-renders
      /* eslint-disable no-underscore-dangle */
      this.options._width = width;
      this.options._height = height;
      /* eslint-enable no-underscore-dangle */

      return {
        width: width,
        height: height
      };
    },

    /**
     * Create the chart and append it to the DOM
     */
    _renderChart: function () {
      if (!this.options.json) {
        // eslint-disable-next-line no-console
        console.warn('The chart needs a JSON spec file to be rendered');
        return;
      }

      var json = Object.assign({}, this.options.json, this._computeChartDimensions());

      vg.parse
        .spec(json, function (error, chart) {
          this.chart = chart({ el: this.chartContainer }).update();
        }.bind(this));
    },

    render: function () {
      this.el.innerHTML = this.template();
      this.chartContainer = this.el.querySelector('.js-chart');
      this._renderChart();
      return this.el;
    }

  });
})(this.App));
