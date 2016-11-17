((function (App) {
  'use strict';

  App.Router.FrontDashboard = Backbone.Router.extend({

    // Global state of the dashboard
    // NOTE: If you update its structure, don't forget to update the _compressState and
    // _decompressState functions used to update the URL and restore the state from it
    state: {
      name: 'New bookmark',
      version: null,
      config: {
        filters: [],
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
      '(/)': 'indexRoute',
      '*hash': 'restoreStateRoute'
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

      // We start the router
      Backbone.history.start({ pushState: false });
    },

    /**
     * Set the listeners that don't depend on a DOM element
     */
    _setListeners: function () {
      this.listenTo(this.filters, 'filters:change', function (filters) {
        this._saveState('filters', filters);
      });
      this.listenTo(this.map, 'state:change', function (state) {
        this._saveState('map', state);
      });
      this.listenTo(this.chart1, 'state:change', function (state) {
        this._saveState('chart1', state);
      });
      this.listenTo(this.chart2, 'state:change', function (state) {
        this._saveState('chart2', state);
      });

      // When the dataset is filtered, we need to update the components
      this.listenTo(this.filters, 'dataset:change', function (dataset) {
        this.filteredDataset = dataset;
        if (this.chart1) {
          this.chart1.options.data = this._getDataset();
          this.chart1.render();
        }
        if (this.chart2) {
          this.chart2.options.data = this._getDataset();
          this.chart2.render();
        }
        if (this.map) {
          this.map.options.data = this._getDataset();
          this.map.render();
        }
      });

      // We would do the same for the map
    },

    /**
     * Retrieve the dataset provided by the dashboard
     * @returns {object[]} dataset
     */
    _getDataset: function () {
      return this.filteredDataset || (window.gon && gon.analysisData.data) || [];
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
     * Init the filters
     */
    _initFilters: function () {
      var dataset = this._getDataset();
      this.filters = new App.View.DashboardFiltersView({
        el: document.querySelector('.js-filters'),
        data: dataset,
        filteringFields: (window.gon && gon.analysisUserFilters) || []
      });
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
     * @param {string} component - "filters", "chart1", "chart2" or "map"
     * @param {object} state - state to save
     */
    _saveState: function (component, state) {
      this.state.version = this._getDashboardVersion();
      switch (component) {
        case 'filters':
          this.state.config.filters = state;
          break;

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

      this._updateUrl();
    },

    /**
     * Compress the state to reduce its footprint
     * With the current structure of the state, we're able to compress it by about 44%
     * @param {object} state
     * @returns {object} compressedState
     */
    _compressState: function (state) {
      var compressedState = {
        v: state.version,
        f: state.config.filters.map(function (filter) { return [filter.name, filter.value]; }),
        la: state.config.map.lat,
        ln: state.config.map.lng,
        z: state.config.map.zoom,
        // We get rid of the charts that don't have any value
        c: this.state.config.charts.map(function (chart) {
          if (!chart.type) return null;
          var res = {
            t: chart.type,
            x: chart.x,
            y: chart.y
          };

          if (!res.y) delete res.y;
          return res;
        }).filter(function (o) {
          return !!o;
        })
      };

      // We remove the entries for which the values evaluate to false and
      // the values that are empty arrays
      var keys = Object.keys(compressedState);
      for (var i = 0, j = keys.length; i < j; i++) {
        var value = compressedState[keys[i]];
        if (!value || (typeof value === 'object' && value.length === 0)) {
          delete compressedState[keys[i]];
        }
      }

      return compressedState;
    },

    /**
     * Decompress the state
     * @param {object} compressedState
     * @returns {object} state
     */
    _decompressState: function (compressedState) {
      return {
        name: this.state.name,
        version: compressedState.v || this.state.version,
        config: {
          filters: (compressedState.f && compressedState.f.map(function (filter) {
            if (!filter.length || filter.length < 2) return null;
            return {
              name: filter[0],
              value: filter[1]
            };
          }).filter(function (filter) {
            return !!filter;
          })) || [],
          map: {
            lat: compressedState.la || this.state.config.map.lat,
            lng: compressedState.ln || this.state.config.map.lng,
            zoom: compressedState.z || this.state.config.map.zoom
          },
          charts: compressedState.c.map(function (chart) {
            return {
              type: chart.t || this.state.config.charts[0].type,
              x: chart.x || this.state.config.charts[0].x,
              y: chart.y || this.state.config.charts[0].y
            };
          }, this) || this.state.config.charts
        }
      };
    },

    /**
     * Return an URL-ready encoded string representing the state
     * @param {object} state - whether compressed or not (i.e. any type of object)
     * @returns {string} - encodedState
     */
    _encodeState: function (state) {
      return encodeURIComponent(btoa(JSON.stringify(state)));
    },

    /**
     * Return the state encoded as an URL
     * NOTE: return null if the state couldn't be decoded properly
     * @param {object} encodedState
     * @returns {object|null} state
     */
    _decodeState: function (encodedState) {
      try {
        return JSON.parse(atob(decodeURIComponent(encodedState)));
      } catch (err) {
        // Couldn't be parsed as a JSON, we return null
        return null;
      }
    },

    /**
     * Construct the URL from a specific state
     * @param {object} state
     * @returns {string} url - absolute URL without the host (for example "/bla")
     */
    _constructURL: function (state) {
      return '/' + this._encodeState(this._compressState(state));
    },

    /**
     * Return the compression ratio of the state
     * @param {object} state - original application state
     * @returns {number} ratio
     */
    _getCompressionRatio: function (state) {
      var encodedOriginalState = this._encodeState(state);
      var encodedCompressedState = this._encodeState(this._compressState(state));
      return (encodedOriginalState.length - encodedCompressedState.length) / encodedOriginalState.length;
    },

    /**
     * Update the URL to reflect the current state of the application
     */
    _updateUrl: function () {
      var url = this._constructURL(this.state);
      this.navigate(url, { replace: true });
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
     * Check if the state is valid by checking the graphs and the filters
     * @param {object} state
     * @returns {boolean} valid - true if valid
     */
    _checkStateValidity: function (state) {
      var dataset = this._getDataset();

      // We check the validity of the charts
      var widgetToolbox = new App.Helper.WidgetToolbox(dataset);
      if (!widgetToolbox.checkStateValidity(state)) return false;

      // We check the validity of the filters: if the filters are based on columns that exist
      // in the first row
      var firstRow = dataset[0];
      return state.config.filters.reduce(function (res, filter) {
        return res && Object.keys(firstRow).indexOf(filter.name) !== -1;
      }, true);
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

      var isStateValid = this._checkStateValidity(state);

      if (!isStateValid) {
        this.warningNotification.hide();
        this.errorNotification.options.content = 'The dashboard\'s state couldn\'t be restored, probably because of changes of the data';
        this.errorNotification.show();

        // We don't forget to still show the interface
        this.filters.render();
        this._renderCharts();
        this._renderMap();

        return false;
      }

      // We restore the filters
      this.filters.setFilters(state.config.filters);
      this.filters.render();

      // We restore the first chart
      var chart1State = {
        chart: state.config.charts[0].type,
        columnX: state.config.charts[0].x,
        columnY: state.config.charts[0].y
      };
      this.chart1.options = Object.assign({}, this.chart1.options, chart1State);

      // We restore the second chart
      var chart2State = {
        chart: state.config.charts[1].type,
        columnX: state.config.charts[1].x,
        columnY: state.config.charts[1].y
      };
      this.chart2.options = Object.assign({}, this.chart2.options, chart2State);

      // We restore the map
      var mapState = {
        center: [state.config.map.lat, state.config.map.lng],
        zoom: state.config.map.zoom
      };
      this.map.options = Object.assign({}, this.map.options, mapState);

      // We finally render the whole dashboard
      this._renderCharts();
      this._renderMap();

      return true;
    },

    /**
     * Render the whole charts components
     */
    _renderCharts: function () {
      this.chart1.render();
      this.chart2.render();
    },

    /**
     * Render the map
     */
    _renderMap: function () {
      this.map.render();
    },

    /**
     * Default route to be called
     */
    indexRoute: function () {
      this._initFilters();
      this.filters.render();
      this._initCharts();
      this._initMap();
      this._setListeners();
      this._renderCharts();
      this._renderMap();
      this._initBookmarks();
    },

    /**
     * Route called whenever the URL contains a state
     */
    restoreStateRoute: function (compressedState) {
      var decodedState = this._decodeState(compressedState);

      // If the decoded state is empty, it's because it failed
      if (!decodedState) {
        this.warningNotification.hide();
        this.errorNotification.options.content = 'The URL you’ve been shared is corrupted. Here is the default dashboard.';
        this.errorNotification.show();
        return;
      }

      // NOTE: the order of the rest of the lines is really important. Please make sure
      // that if you modify it, you try to reach the dashboard without the state param,
      // and with the state param with and without the filters

      // We init the filters, the charts and the map
      this._initFilters();
      this._initCharts();
      this._initMap();

      // We need to initialize the listeners before they start to trigger events
      this._setListeners();

      var state = this._decompressState(decodedState);
      if (this._restoreState(state)) {
        // Even if when the charts will be render, they will emit an event with their state
        // and thus this.state will be updated, the version number won't, that's why we need
        // to save the state before
        this.state = state;
      }

      this._initBookmarks();
    }

  });
})(this.App));
