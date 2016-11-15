((function (App) {
  'use strict';

  App.View.DashboardChartView = Backbone.View.extend({

    template: HandlebarsTemplates['front/dashboard-chart'],

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
      // Configuration of the charts
      chartConfig: [],
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
     * Creates the instance of Jiminy and attach it to this.jiminy
     */
    _initJiminy: function () {
      this.jiminy = new Jiminy(this.options.data, this.options.chartConfig);
    },

    /**
     * Return the list of charts that can be generated with the dataset
     * @returns {string[]}
     */
    _getAvailableCharts: function () {
      if (!this.jiminy) this._initJiminy();
      return this.jiminy.recommendation();
    },

    /**
     * Return the available x columns for the selected chart
     * @param {string} chart - check the available columns for this specific chart (optional)
     * @returns {string[]}
     */
    _getAvailableXColumns: function (chart) {
      if (!this.jiminy) this._initJiminy();
      return this.jiminy.columns(chart || this.options.chart);
    },

    /**
     * Return the available y columns for the selected chart and x column
     * The method can return null if the chart only accept one column (for the pie for example)
     * @param {string} xColumn - x column name
     * @param {string} chart - check the available columns for this specific chart (optional)
     * @returns {string[]|null}
     */
    _getAvailableYColumns: function (xColumn, chart) {
      if (!this.jiminy) this._initJiminy();
      return this.jiminy.columns(chart || this.options.chart, xColumn);
    },

    /**
     * Return two random columns that can be used to generate the chart (x and y)
     * The y column can be null depending on the chart
     * @return {{ x: string, y: string }}
     */
    _getRandomColumns: function () {
      if (!this.jiminy) this._initJiminy();

      var xColumns = this._getAvailableXColumns();
      var xColumn;
      if (!xColumns.length) {
        // eslint-disable-next-line no-console
        console.warn('Unable to generate a chart out of the current dataset');
        return { x: null, y: null };
      }

      xColumn = xColumns[0];

      var yColumns = this._getAvailableYColumns(xColumn);
      var yColumn = yColumns.length ? yColumns[0] : null;

      return {
        x: xColumn,
        y: yColumn
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
        var availableCharts = this._getAvailableCharts();
        if (availableCharts.length) {
          this.options.chart = availableCharts[0];
        } else {
          // eslint-disable-next-line no-console
          console.warn('Unable to generate a chart out of the current dataset');
          return {};
        }
      }

      var columns = this._getRandomColumns();
      var chartDimensions = this._computeChartDimensions();
      var needsRandomColumns = !this.options.columnX && !this.options.columnY;

      return this._getChartTemplate()({
        data: JSON.stringify(this.options.data),
        xColumn: JSON.stringify(needsRandomColumns ? columns.x : this.options.columnX),
        yColumn: JSON.stringify(needsRandomColumns ? columns.y : this.options.columnY),
        width: chartDimensions.width,
        height: chartDimensions.height
      });
    },

    /**
     * Create the chart and append it to the DOM
     */
    _renderChart: function () {
      if (!this.options.data.length) {
        // eslint-disable-next-line no-console
        console.warn('The chart needs a JSON spec file to be rendered');
        return;
      }

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
      hierarchy.options = this._getAvailableCharts().map(function (chartName) {
        var chart = _.findWhere(this.options.chartConfig, { name: chartName });
        var acceptedColumnsNb = chart.acceptedStatTypes[0].length;

        var res = { name: chartName, id: chartName };
        res.label = acceptedColumnsNb === 1 ? 'Select a column' : 'Select X column';
        res.options = this._getAvailableXColumns(chartName).map(function (xColumn) {
          var o = {};
          o.name = xColumn;
          o.id = xColumn;

          if (acceptedColumnsNb > 1) {
            o.label = 'Select Y column';
            o.options = this._getAvailableYColumns(xColumn, chartName).map(function (yColumn) {
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
      this.el.innerHTML = this.template();
      this.chartContainer = this.el.querySelector('.js-chart');
      this.chartSelectorContainer = this.el.querySelector('.js-chart-selector');
      this._renderChart();
      this._renderChartSelector();
      return this.el;
    }

  });
})(this.App));
