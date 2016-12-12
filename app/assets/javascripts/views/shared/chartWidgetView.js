((function (App) {
  'use strict';

  App.View.ChartWidgetView = Backbone.View.extend({

    template: HandlebarsTemplates['front/chart-widget'],

    defaults: {
      // Ratio between the height and the width (i.e. height = chartRatio * width)
      chartRatio: 0.6,
      // Data to display on the chart
      data: [],
      // Name of the default chart type
      chart: null,
      // Name of the column x
      columnX: null,
      // Name of the column y
      columnY: null,
      // Enable the chart selector
      enableChartSelector: true,
      // Inner width of the chart, used internally
      _width: null,
      // Inner height of the chart, used internally
      _height: null
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.widgetToolbox = new App.Helper.WidgetToolbox(this.options.data);
      this._setListeners();

      // We pre-render the component with its template
      this.el.innerHTML = this.template();
      this.chartContainer = this.el.querySelector('.js-chart');
      this.chartSelectorContainer = this.el.querySelector('.js-chart-selector');
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
      if (!this.options.chart) return;

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
     * Event handler for when the chart is changed by the selector
     * @param {string[]} - chart, column x, column y
     */
    _onChangeChart: function () {
      this.options.chart = arguments[0][0];
      this.options.columnX = arguments[0][1];
      this.options.columnY = arguments[0].length > 2 ? arguments[0][2] : null;
      this._renderChart();
    },

    /**
     * Compute the chart dimensions
     * @returns {{ width: number, height: number}}
     */
    _computeChartDimensions: function () {
      // We render the template with fake data in order to parse it as a JS object and retrieve the padding
      var chartTemplate = JSON.parse(this._getChartTemplate()({
        data: JSON.stringify([]),
        xColumn: JSON.stringify(''),
        yColumn: JSON.stringify(''),
        width: JSON.stringify(''),
        height: JSON.stringify('')
      }));

      var containerDimensions = this.chartContainer.getBoundingClientRect();

      var padding = Object.assign({}, chartTemplate.padding, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      });

      var width = Math.round(containerDimensions.width - padding.left - padding.right);
      var height = Math.round(width * this.options.chartRatio);

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
     * Get the chart Handlebars template
     * @returns {function}
     */
    _getChartTemplate: function () {
      return HandlebarsTemplates['front/charts/' + this.options.chart];
    },

    /**
     * Generate the vega spec
     * @returns {object}
     */
    _generateVegaSpec: function () {
      if (!this.options.chart) {
        var availableCharts = this.widgetToolbox.getAvailableCharts();
        if (availableCharts.length) {
          this.options.chart = availableCharts[0];
        } else {
          // eslint-disable-next-line no-console
          console.warn('Unable to generate a chart out of the current dataset');
          return {};
        }
      }

      var chartDimensions = this._computeChartDimensions();

      // We check if we need to automatically select the columns
      if (!this.options.columnX && !this.options.columnY) {
        var columns = this.widgetToolbox.getChartRandomColumns(this.options.chart);
        this.options.columnX = columns.x;
        this.options.columnY = columns.y;
      }

      return this._getChartTemplate()({
        data: JSON.stringify(this.options.data),
        xColumn: JSON.stringify(this.options.columnX),
        yColumn: JSON.stringify(this.options.columnY),
        width: chartDimensions.width,
        height: chartDimensions.height
      });
    },

    /**
     * Create the chart and append it to the DOM
     */
    _renderChart: function () {
      // If no data, we render an empty chart

      // We save the state of the widget each time we render as it can be the
      // consequence of a change in the configuration
      this.trigger('state:change', {
        type: this.options.chart,
        x: this.options.columnX,
        y: this.options.columnY
      });

      vg.parse
        .spec(JSON.parse(this._generateVegaSpec()), function (error, chart) {
          this.chart = chart({ el: this.chartContainer }).update();
        }.bind(this));
    },

    /**
     * Create the chart selector and append it to the DOM
     */
    _renderChartSelector: function () {
      var hierarchy = { label: 'Customize chart', options: [] };
      hierarchy.options = this.widgetToolbox.getAvailableCharts().map(function (chartName) {
        var chart = _.findWhere(this.widgetToolbox.getChartConfig(), { name: chartName });
        var acceptedColumnsNb = chart.acceptedStatTypes[0].length;

        var res = { name: chartName, id: chartName };
        res.label = acceptedColumnsNb === 1 ? 'Select a column' : 'Select X column';
        res.options = this.widgetToolbox.getAvailableXColumns(chartName).map(function (xColumn) {
          var o = {};
          o.name = xColumn;
          o.id = xColumn;

          if (acceptedColumnsNb > 1) {
            o.label = 'Select Y column';
            o.options = this.widgetToolbox.getAvailableYColumns(chartName, xColumn).map(function (yColumn) {
              // eslint-disable-next-line no-shadow
              var o = {};
              o.name = yColumn;
              o.id = yColumn;
              return o;
            });
          }

          return o;
        }, this);

        return res;
      }, this);

      new App.View.HierarchicalSelectView({
        el: this.chartSelectorContainer,
        ID: +(new Date()),
        hierarchy: hierarchy,
        onChange: this._onChangeChart.bind(this)
      });
    },

    render: function () {
      this._renderChart();
      if (this.options.enableChartSelector) this._renderChartSelector();
      return this.el;
    }

  });
})(this.App));
