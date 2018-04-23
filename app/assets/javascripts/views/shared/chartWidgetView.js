/* eslint-disable */
((function (App) {
  'use strict';

  App.View.ChartWidgetView = Backbone.View.extend({

    template: HandlebarsTemplates['front/chart-widget'],
    metadataModalTemplate: HandlebarsTemplates['shared/table-metadata'],

    defaults: {
      // Ratio between the height and the width (i.e. height = chartRatio * width)
      // If you update this value, please update the .large-widget's height (l-analysis-dashboard)
      chartRatio: 0.5,
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
      // Callback to execute when the switch button is pressed
      // The switch button will only appear if switchCallback is a function
      // The swith button let the user switch the chart for a map
      switchCallback: null,
      // Inner width of the chart, used internally
      _width: null,
      // Inner height of the chart, used internally
      _height: null,
      // Flag that determines whether the widget is visible or not
      visible: true
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      if (this.options.data.length) this.widgetToolbox = new App.Helper.WidgetToolbox(this.options.data);
      this._setListeners();
      this._rendering = false;
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

    _setRendering: function (rendering) {
      this._rendering = rendering;
      var chart = this.el.querySelector('.js-chart');
      if (this._rendering) {
        chart.classList.add('c-loading-spinner');
        chart.classList.add('-full-size');
        chart.classList.add('-bg');
        chart.classList.add('-blank');
      } else {
        setTimeout(function () {
          chart.classList.remove('c-loading-spinner');
          chart.classList.remove('-full-size');
          chart.classList.remove('-bg');
          chart.classList.remove('-blank');
        }, 500);
      }
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
      this.options.xLabel = null;
      this.options.yLabel = null;

      this.render();
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
        xLabel: JSON.stringify(''),
        yLabel: JSON.stringify(''),
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
      if (!this.options.data.length) return HandlebarsTemplates['front/charts/empty'];
      return HandlebarsTemplates['front/charts/' + this.options.chart];
    },
    /**
     *  Get the vega theme
     *  @returns {string}
     */
    _getVegaTheme: function () {
      return JSON.parse(HandlebarsTemplates['front/charts/vegaTheme']());
    },

    /**
     * Generate the vega spec
     * @returns {object}
     */
    _generateVegaSpec: function () {
      if (this.options.data.length && !this.options.chart) {
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
      if (this.options.data.length && !this.options.columnX && !this.options.columnY) {
        var columns = this.widgetToolbox.getChartRandomColumns(this.options.chart);
        this.options.columnX = columns.x;
        this.options.columnY = columns.y;
      }

      var columnX = JSON.stringify(this.options.columnX);
      var columnY = JSON.stringify(this.options.columnY);
      var labelX = this.options.xLabel;
      var labelY = this.options.yLabel;
      var xLabel = columnX;
      var yLabel = columnY;

      if (labelX !== undefined && labelX !== null && labelX !== ''){
        xLabel = JSON.stringify(labelX);
      }

      if (labelY !== undefined && labelY !== null && labelY !== ''){
        yLabel = JSON.stringify(labelY);
      }

      return this._getChartTemplate()({
        data: JSON.stringify(this.options.data),
        xColumn: columnX,
        yColumn: columnY,
        width: chartDimensions.width,
        height: chartDimensions.height,
        xLabel: xLabel,
        yLabel: yLabel
      });
    },

    /**
     * Create the chart and append it to the DOM
     */
    _renderChart: function () {
      if (!this._rendering) {
        this._setRendering(true);
        // The widget toolbox could be non-assigned if the view has been instantiated
        // with no data
        if (this.options.data.length && !this.widgetToolbox) {
          this.widgetToolbox = new App.Helper.WidgetToolbox(this.options.data);
        }
        // TODO: Move this to react ?
        requestAnimationFrame(function () {
          vg.parse
            .spec(JSON.parse(this._generateVegaSpec()), this._getVegaTheme(), function (error, chart) {
              if (error) {
                App.notifications.broadcast(App.Helper.Notifications.dashboard.chartError);
                return;
              }

              this.chart = chart({
                el: this.chartContainer,
                // By using the SVG renderer, we give the client the possibility to
                // translate the text contained in the charts
                renderer: 'svg'
              }).update();

              this._setRendering(false);
            }.bind(this));
          if (this.options.enableChartSelector && this.options.displayMode !== 'dashboard') {
            // TODO: use displayMode to enable the render of rest of the buttons and inputs
            this._renderCustomAxisLabelInput();
          }
        }.bind(this));
      }
      // We don't want to trigger anything if the dataset is empty
      if (!this.options.data.length) return;
      // We save the state of the widget each time we render as it can be the
      // consequence of a change in the configuration
      // NOTE: We need to make sure in case the view hasn't been instantiated with
      // a chart configuration that it's set by the toolbox before triggering
      this.trigger('state:change', {
        type: 'chart',
        chart: this.options.chart,
        x: this.options.columnX,
        y: this.options.columnY,
        xLabel: this.options.xLabel,
        yLabel: this.options.yLabel,
        visible: this.options.visible
      });
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
        onChange: _.throttle(this._onChangeChart.bind(this), 300)
      });
    },

    /**
     * Render the switch button and attach an event listener to it
     */
    _renderSwitchButton: function () {
      var switchContainer = this.el.querySelector('.js-switch-button');
      if (switchContainer.children.length) {
        switchContainer.innerHTML = '';
      }
      // We create the button
      var button = document.createElement('button');
      button.type = 'button';
      button.classList.add('c-button');
      button.classList.add('switch-button');
      button.textContent = 'Switch for map';

      // We attach the listener
      button.addEventListener('click', this.options.switchCallback);

      // We append the button to the DOM
      switchContainer.appendChild(button);
    },
    /**
     * Render the Toggle Visibility button and attach an event listener to it
     */
    _renderToggleVisibilityButton: function () {
      var toggleContainer = this.el.querySelector('.js-toggle-visibility-button');
      if (toggleContainer.children.length) {
        toggleContainer.innerHTML = '';
      }
      // We create the button
      var button = document.createElement('button');
      button.type = 'button';
      button.classList.add('c-button');
      button.classList.add('toggle-visibility-button');
      if (!this.options.visible) button.classList.add('-slashed');
      button.textContent = 'Hide';
      // We attach the listener
      button.addEventListener('click', function() {
        button.classList.toggle('-slashed');
        this._toggleVisibility();
      }.bind(this));

      // We append the button to the DOM
      toggleContainer.appendChild(button);
    },
    /**
     * Trigger widget visibility change
     */
    _toggleVisibility: function () {
      this.options.visible = !this.options.visible;
      this.trigger('state:change', { visible: this.options.visible });
    },
    /**
     * Render the Custom Axis Label Inputs and attach an event listener to it
     */
    _renderCustomAxisLabelInput: function () {
      var inputContainer = this.el.querySelector('#custom-axis-input-container');
      if (inputContainer.children.length) {
        inputContainer.innerHTML = '';
      }

      var axes = ['X', 'Y'];

      axes.forEach(function (axis) {
        // We create the input
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'custom-' + axis);
        input.setAttribute('class', '-dashboard');

        var axisLabel = null;
        var placeholder = 'Custom ' + axis + ' label';

        if (axis === 'X') {
          axisLabel = this.options.xLabel;
          if (!this.options.columnY) placeholder = 'Custom label';
          input.setAttribute('placeholder', placeholder);
        } else {
          axisLabel = this.options.yLabel;
          if (this.options.columnY) input.setAttribute('placeholder', placeholder);
          else input.setAttribute('disabled', 'disabled');
        }

        if (axisLabel) input.value = axisLabel;

        // We attach the listeners
        input.addEventListener('change', function () {
          this._changeAxisLabel(axis, input.value);
        }.bind(this));

        // We append the inputs to the DOM
        inputContainer.appendChild(input);
      }.bind(this));
    },
    _changeAxisLabel: function(axis, value){
      if(axis === 'X') this.options.xLabel = value;
      else this.options.yLabel = value;
      this._renderChart();
    },
    /**
     * Remove the changes the component implied to the container and all of
     * its children
     */
    remove: function () {
      this.el.innerHTML = '';
    },
    /**
     * Render the info button that will show the metadata modal.
     */
    _renderInfoButton: function () {
      var button = $('<button type="button" class="c-table-action-button -info js-metadata-info metadata-button"></button>');
      var values = JSON.stringify(this.options.metadata);
      button.attr('data-values', values);
      this.$el.append(button);

      this.$('.js-metadata-info').on('click', this._onClickMetadataInfo.bind(this));
    },

    /**
     * Listener for the click on the "info" button
     * @param {Event} e - event
     */
    _onClickMetadataInfo: function (e) {
      var button = e.target;
      var values = JSON.parse(button.dataset.values);

      var modal = new (App.View.ModalView.extend({
        render: function () {
          return this.metadataModalTemplate({
            values: values
          });
        }.bind(this)
      }))();

      modal.open();
    },

    render: function () {
      this._renderChart();

      // We don't render the chart selector and the switch button if the dataset is empty
      if (this.options.data.length) {
        if (this.options.enableChartSelector) {
          this._renderChartSelector();
        }
        if (this.options.switchCallback && typeof this.options.switchCallback === 'function') {
          this._renderSwitchButton();
          this._renderToggleVisibilityButton();
        }
      }
      if(this.options.displayMode !== 'dashboard' && this.options.metadata) {
        this._renderInfoButton();
      }
      return this.el;
    }

  });
})(this.App));
