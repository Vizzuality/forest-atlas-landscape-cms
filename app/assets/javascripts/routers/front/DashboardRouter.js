((function (App) {
  'use strict';

  App.Router.FrontDashboard = Backbone.Router.extend({

    // Global state of the dashboard
    state: {
      name: 'New bookmark',
      version: null,
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

      // We create instances of the notifications so we reuse them to avoid duplicates
      // of the exact same one layered on top one of another
      this.warningNotification = new App.View.NotificationView({ type: 'warning' });
      this.errorNotification = new App.View.NotificationView({ type: 'error' });

      this._initCharts();
      this._initMap();
      this._initBookmarks();
      this._setListeners();
      this._renderCharts();
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
     * Retrieve the dataset provided by the dashboard
     * @returns {object[]} dataset
     */
    _getDataset: function () {
      return (window.gon && gon.analysisData.data) || [];
    },

    /**
     * Retrieve the dashboard's version
     * @returns {string} version
     */
    _getDashboardVersion: function () {
      return (window.gon && gon.analysisTimestamp) || null;
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
        setState: this._restoreState.bind(this)
      });
    },

    /**
     * Save the state of the specified component into a global state object
     * @param {string} component - "chart1", "chart2" or "map"
     * @param {object} state - state to save
     */
    _saveState: function (component, state) {
      this.state.version = this._getDashboardVersion();
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

    /**
     * Check if the version of the state matches the latest version of the dashboard
     * @param {object} state
     * @returns {boolean} upToDate - true if up to date
     */
    _checkStateVersion: function (state) {
      var dashboardVersion = this._getDashboardVersion();
      // eslint-disable-next-line no-console
      if (!dashboardVersion) console.warn('The dashboard isn\'t versioned. Versioning permits the detection of possible conflicts with the saved states');
      return !dashboardVersion || state.version === dashboardVersion;
    },

    /**
     * Restore the state of the dashboard
     * NOTE: must be called after _renderCharts
     * @param {object} state
     * @returns {boolean} restored - true if the state could be restored
     */
    _restoreState: function (state) {
      var isStateUpToDate = this._checkStateVersion(state);

      if (!isStateUpToDate) {
        this.errorNotification.hide();
        this.warningNotification.options.content = 'The dashboard configuration has been updated and it might affect the visualizations';
        this.warningNotification.show();
      }

      var widgetToolbox = new App.Helper.WidgetToolbox(this._getDataset());
      var isStateValid = widgetToolbox.checkStateValidity(state);

      if (!isStateValid) {
        this.warningNotification.hide();
        this.errorNotification.options.content = 'The dashboard\'s state couldn\'t be restored, probably because of changes of the data';
        this.errorNotification.show();
        return false;
      }

      // We restore the first chart
      var chart1State = {
        chart: state.config.charts[0].type,
        columnX: state.config.charts[0].x,
        columnY: state.config.charts[0].y
      };
      this.chart1.options = Object.assign({}, this.chart1.options, chart1State);
      this.chart1.renderChart();

      // We restore the second chart
      var chart2State = {
        chart: state.config.charts[1].type,
        columnX: state.config.charts[1].x,
        columnY: state.config.charts[1].y
      };
      this.chart2.options = Object.assign({}, this.chart2.options, chart2State);
      this.chart2.renderChart();

      // TODO do the same for the map

      return true;
    },

    /**
     * Render the whole charts components
     */
    _renderCharts: function () {
      this.chart1.render();
      this.chart2.render();
    },

    index: function () {

    }

  });
})(this.App));
