((function (App) {
  'use strict';

  App.Router.FrontDashboard = Backbone.Router.extend({

    // Global state of the dashboard
    state: {
      name: 'New bookmark',
      config: {
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
      }
    },

    routes: {
      '(/)': 'index'
    },

    initialize: function () {
      // Instantiate the common views here for the page, use the "routes" object to instantiate
      // per route views
      new App.View.HeaderView({
        el: document.querySelector('.js-header')
      });

      this._initCharts();
      this._initMap();
      this._initBookmarks();
      this._setListeners();
    },

    /**
     * Set the listeners that don't depend on a DOM element
     */
    _setListeners: function () {
      this.listenTo(this.chart1, 'state:change', function (state) {
        this._saveState('chart1', state);
      });
      this.listenTo(this.chart2, 'state:change', function (state) {
        this._saveState('chart2', state);
      });

      // We would do the same for the map
    },

    /**
     * Init the charts
     */
    _initCharts: function () {
      var dataset = (window.gon && gon.analysisData.data) || [];
      var charts = (window.gon && gon.analysisGraphs) || [{}, {}];

      this.chart1 = new App.View.ChartWidgetView({
        el: document.querySelector('.js-chart-1'),
        data: dataset,
        chartConfig: App.Helper.ChartConfig,
        chart: charts[0].type || null,
        columnX: charts[0].x || null,
        columnY: charts[0].y || null
      });

      this.chart2 = new App.View.ChartWidgetView({
        el: document.querySelector('.js-chart-2'),
        data: dataset,
        chartConfig: App.Helper.ChartConfig,
        chart: charts[1].type || null,
        columnX: charts[1].x || null,
        columnY: charts[1].y || null
      });
    },

    /**
     * Init the map
     */
    _initMap: function () {
      // This JS will probably be moved to independent views once the architecture will be refined
      var map = L.map(document.querySelector('.js-map'), {
        scrollWheelZoom: false
      })
        .setView([40.44, -3.70], 10);
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
    },

    /**
     * Init the bookmarks
     */
    _initBookmarks: function () {
      new App.View.DashboardBookmarksView({
        el: document.querySelector('.js-bookmarks'),
        getState: function () { return this.state; }.bind(this),
        setState: function (state) { console.log(state); }
      });
    },

    /**
     * Save the state of the specified component into a global state object
     * @param {string} component - "chart1", "chart2" or "map"
     * @param {object} state - state to save
     */
    _saveState: function (component, state) {
      switch (component) {
        case 'map':
          this.state.config.map = Object.assign({}, this.state.config.map, state);
          break;

        case 'chart1':
          this.state.config.charts[0] = Object.assign({}, this.state.config.charts[0], state);
          break;

        case 'chart2':
          this.state.config.charts[1] = Object.assign({}, this.state.config.charts[1], state);
          break;

        default:
      }
    },

    index: function () {

    }

  });
})(this.App));
