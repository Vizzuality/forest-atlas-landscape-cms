((function (App) {
  'use strict';

  App.Router.ManagementPreviewStep = Backbone.Router.extend({

    state: {
      map: {
        lat: null,
        lng: null,
        zoom: null
      },
      charts: [
        {
          type: null,
          x: null,
          y: null
        },
        {
          type: null,
          x: null,
          y: null
        }
      ]
    },

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      this._initCharts();
      this._initMap();
      this._setListeners();

      this.chart1.render();
      this.chart2.render();
      this.map.render();
    },

    /**
     * Set the listeners that don't depend on a DOM element
     */
    _setListeners: function () {
      this.listenTo(this.map, 'state:change', function (state) {
        this._saveState('map', state);
      });
      this.listenTo(this.chart1, 'state:change', function (state) {
        this._saveState('chart1', state);
      });
      this.listenTo(this.chart2, 'state:change', function (state) {
        this._saveState('chart2', state);
      });
    },

    /**
     * Save the state of the specified component into a global state object
     * @param {string} component - "filters", "chart1", "chart2" or "map"
     * @param {object} state - state to save
     */
    _saveState: function (component, state) {
      switch (component) {
        case 'map':
          this.state.map = Object.assign({}, this.state.map, state);
          break;

        case 'chart1':
          this.state.charts[0] = Object.assign({}, this.state.charts[0], state);
          break;

        case 'chart2':
          this.state.charts[1] = Object.assign({}, this.state.charts[1], state);
          break;

        default:
      }

      this._updateHiddenFields();
    },

    /**
     * Update the hidden fields so when the user submits the form, the back end saves
     * the configuration
     */
    _updateHiddenFields: function () {
      if (!this.chartsInput) {
        this.chartsInput = document.querySelector('.js-charts-input');
        this.mapInput = document.querySelector('.js-map-input');
      }

      this.chartsInput.value = JSON.stringify(this.state.charts);

      var map = Object.assign({}, this.state.map);
      map.lon = map.lng;
      delete map.lng;
      this.mapInput.value = JSON.stringify(map);
    },

    /**
     * Return the dataset
     * @returns {object[]} dataset
     */
    _getDataset: function () {
      return (window.gon && gon.analysisData.data) || [];
    },

    /**
     * Retrieve the dashboard's charts
     * @returns {object[]} charts
     */
    _getDashboardCharts: function () {
      return (window.gon && gon.analysisGraphs) || [{}, {}];
    },

    /**
     * Init the charts
     */
    _initCharts: function () {
      var dataset = this._getDataset();
      var charts = this._getDashboardCharts();

      this.chart1 = new App.View.ChartWidgetView({
        el: document.querySelector('.js-chart-1'),
        data: dataset,
        chart: charts[0].type || null,
        columnX: charts[0].x || null,
        columnY: charts[0].y || null
      });

      this.chart2 = new App.View.ChartWidgetView({
        el: document.querySelector('.js-chart-2'),
        data: dataset,
        chart: charts[1].type || null,
        columnX: charts[1].x || null,
        columnY: charts[1].y || null
      });
    },

    /**
     * Init the map
     */
    _initMap: function () {
      var dataset = this._getDataset();
      var type = (window.gon && gon.analysisMap.graphType) || null;
      var center = [
        (window.gon && gon.analysisMap.lat) || null,
        (window.gon && gon.analysisMap.lon) || null
      ];
      var zoom = (window.gon && gon.analysisMap.zoom) || null;

      var params = {
        el: document.querySelector('.js-map'),
        data: dataset,
        // TODO
        // Once gon is updated, we should retrieve the real names of the fields used to position
        // the dots
        fields: {
          lat: 'latitude' || null,
          lng: 'longitude' || null
        }
      };

      if (type) params.type = type;
      if (center[0] && center[1]) params.center = center;
      if (zoom) params.zoom = zoom;

      this.map = new App.View.MapWidgetView(params);
    }

  });
})(this.App));
