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

  App.Router.FrontDashboard = Backbone.Router.extend({

    // Global state of the dashboard
    // NOTE: If you update its structure, don't forget to update the _compressState and
    // _decompressState functions used to update the URL and restore the state from it
    state: {
      name: 'Untitled',
      version: null,
      config: {
        filters: [],
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
      '(/)': 'indexRoute',
      '*hash': 'restoreStateRoute'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      // Instantiate the common views here for the page, use the "routes" object to instantiate
      // per route views
      new App.View.HeaderView({
        el: document.querySelector('.js-header')
      });

      this._initDescription();

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

      for (var i = 0, j = this.options.widgetsCount; i < j; i++) {
        // We wrap the listener in an IIFE to copy the value of i
        // eslint-disable-next-line no-loop-func, no-shadow
        (function (i) {
          this.listenTo(this['widget' + i], 'state:change', function (state) {
            this._saveState('widget' + i, state);
          });
        }.call(this, i));
      }

      // When the dataset is filtered, we need to update the components
      this.listenTo(this.filters, 'dataset:change', function (dataset) {
        this.filteredDataset = dataset;

        // eslint-disable-next-line no-shadow
        for (var i = 0, j = this.options.widgetsCount; i < j; i++) {
          if (this['widget' + i]) {
            this['widget' + i].options.data = this._getDataset();
            this['widget' + i].render();
          }
        }

        if (this.table) {
          this._initTable();
        }
      });
    },

    /**
     * Retrieve the dataset provided by the dashboard
     * @param {{ unfiltered: boolean }} options
     * @returns {object[]} dataset
     */
    _getDataset: function (options) {
      return ((!options || !options.unfiltered) && this.filteredDataset) || (window.gon && gon.analysisData.data) || [];
    },

    /**
     * Retrieve the dashboard's version
     * @returns {string} version
     */
    _getDashboardVersion: function () {
      return (window.gon && gon.analysisTimestamp) || null;
    },

    /**
     * Retrieve the list of widgets
     * @returns {object[]} widgets
     */
    _getDashboardWidgets: function () {
      return (window.gon && gon.analysisWidgets) || [];
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
          closeCallback: function () { this.descriptionModal.close(); }.bind(this)
        });

        this.descriptionModal.render = descriptionDashboardModalView.render;
      }

      this.descriptionModal.open();
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
      var tableCollection = this._getTableCollection();
      var tableContainer = document.querySelector('.js-table');

      if (tableCollection.length === 0) {
        tableContainer.innerHTML = '<p class="no-data">The dataset is empty.</p>';
      } else {
        this.table = new App.View.TableView({
          el: tableContainer,
          collection: this._getTableCollection(),
          tableName: 'Dashboard data'
        });
      }
    },

    /**
     * Init the widgets
     */
    _initWidgets: function () {
      var dataset = this._getDataset();
      var widgets = this._getDashboardWidgets();

      widgets.forEach(function (widget, index) {
        if (widget && widget.type === 'map' && widget.visible) {
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
            center: [widget.lat || 0, widget.lng || 0],
            zoom: widget.zoom
          });
        } else if (widget && widget.type === 'chart' && widget.visible) {
          this['widget' + index] = new App.View.ChartWidgetView({
            el: document.querySelector('.js-widget-' + (index + 1)),
            data: dataset,
            chart: widget.chart,
            columnX: widget.x,
            columnY: widget.y
          });
        }
      }, this);
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
     * @param {string} component - "filters", "widget0", "widget1" or "widget2"
     * @param {object} state - state to save
     */
    _saveState: function (component, state) {
      this.state.version = this._getDashboardVersion();
      switch (component) {
        case 'filters':
          this.state.config.filters = state;
          break;

        default:
          var index = +component.slice(-1);
          this.state.config.widgets[index] = Object.assign({}, this.state.config.widgets[index], state);
          break;
      }

      this._updateUrl();
    },

    /**
     * Compress the state to reduce its footprint
     * With the current structure of the state, we're able to compress it by more than 30%
     * @param {object} state
     * @returns {object} compressedState
     */
    _compressState: function (state) {
      var compressedState = {
        v: state.version,
        f: state.config.filters.map(function (filter) { return [filter.name, filter.value]; }),
        w: this.state.config.widgets.map(function (chart) {
          if (!chart.type) return null;
          var res = {
            t: chart.type,
            v: chart.visible
          };

          if (chart.type === 'map') {
            res.la = chart.lat;
            res.ln = chart.lng;
            res.z = chart.zoom;
          } else {
            res.x = chart.x;
            res.c = chart.chart;
            if (chart.y) res.y = chart.y;
          }

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
          widgets: compressedState.w && compressedState.w.map(function (widget) {
            if (widget.t === 'map') {
              return {
                type: 'chart',
                lat: widget.la,
                lng: widget.ln,
                zoom: widget.z,
                visible: widget.v
              };
            }

            return {
              type: 'chart',
              chart: widget.c,
              x: widget.x,
              y: widget.y || null,
              visible: widget.v || true
            };
          })
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
      return this._encodeState(this._compressState(state));
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
      var url = '#' + this._constructURL(this.state);
      // NOTE: We can't use this.navigate because we can't pass the "state" option.
      // Adding { turbolinks: {} } is mandatory to avoid breaking the browser's back button
      // because Turbolinks doesn't handle well the URL changes
      // Check here: https://github.com/turbolinks/turbolinks/issues/219
      history.replaceState({ turbolinks: {} }, '', url);
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
      var dataset = this._getDataset({ unfiltered: true });

      // We check we have all the widgets and the dataset isn't empty
      if (!state.config || !state.config.widgets || !dataset.length) {
        return false;
      }

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
     * NOTE: must be called before _renderWidgets
     * @param {object} state
     * @returns {boolean} restored - true if the state could be restored
     */
    _restoreState: function (state) {
      var isStateUpToDate = this._checkStateVersion(state);

      if (!isStateUpToDate) {
        App.notifications.broadcast(App.Helper.Notifications.dashboard.changed);
      }

      var isStateValid = this._checkStateValidity(state);

      if (!isStateValid) {
        App.notifications.broadcast(App.Helper.Notifications.dashboard.invalid);

        // We don't forget to still show the interface
        this.filters.render();
        this._renderWidgets();

        return false;
      }

      // We restore the filters
      this.filters.setFilters(state.config.filters);
      this.filters.render();

      // We restore the widgets
      for (var i = 0, j = this.options.widgetsCount; i < j; i++) {
        var widget = state.config.widgets[i];
        if (this['widget' + i]) {
          if (widget && widget.type === 'map') {
            this['widget' + i].options = Object.assign({}, this['widget' + i].options, {
              center: [widget.lat, widget.lng],
              zoom: widget.zoom
            });
          } else if (widget){
            this['widget' + i].options = Object.assign({}, this['widget' + i].options, {
              chart: widget.chart,
              columnX: widget.x,
              columnY: widget.y
            });
          }
        }
      }

      // We finally render the whole dashboard
      this._renderWidgets();

      return true;
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
     * Default route to be called
     */
    indexRoute: function () {
      this._initFilters();
      this.filters.render();
      this._initTable();
      this._initWidgets();
      this._setListeners();
      this._renderWidgets();
      this._initBookmarks();
    },

    /**
     * Route called whenever the URL contains a state
     */
    restoreStateRoute: function (compressedState) {
      var decodedState = this._decodeState(compressedState);

      // If the decoded state is empty, it's because it failed
      if (!decodedState) {
        App.notifications.broadcast(App.Helper.Notifications.dashboard.corrupted);

        // We load the dashboard as if there weren't any state in the URL
        this.indexRoute();

        return;
      }

      // NOTE: the order of the rest of the lines is really important. Please make sure
      // that if you modify it, you try to reach the dashboard without the state param,
      // and with the state param with and without the filters

      // We init the filters, the table and the widgets
      this._initFilters();
      this._initTable();
      this._initWidgets();

      // We need to initialize the listeners before they start to trigger events
      this._setListeners();

      var state = this._decompressState(decodedState);
      if (this._restoreState(state)) {
        // Even if when the widgets will be render, they will emit an event with their state
        // and thus this.state will be updated, the version number won't, that's why we need
        // to save the state before
        this.state = state;
      }

      this._initBookmarks();
    }

  });
})(this.App));
