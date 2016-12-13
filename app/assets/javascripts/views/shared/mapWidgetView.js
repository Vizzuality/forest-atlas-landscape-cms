((function (App) {
  'use strict';

  App.View.MapWidgetView = Backbone.View.extend({
    className: 'c-map-widget',

    defaults: {
      // Data to display on the chart
      data: [],
      // Name of the default representation (only "dots" for now)
      type: 'dots',
      // Center of the map
      center: [0, 0],
      // Zoom of the map
      zoom: 3,
      // Name of the fields used to position the dots on the map
      // { lat, lng }
      fields: {},
      // Options to be passed at the map instantiation
      mapOptions: {
      }
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
    },

    /**
     * Attach all the listeners that are not dependent on a DOM element
     */
    _setListeners: function () {
      if (!this.map) return;

      this.map.on('zoomend moveend', function () {
        this.options.center = [this.map.getCenter().lat, this.map.getCenter().lng];
        this.options.zoom = this.map.getZoom();
        this._triggerState();
      }.bind(this));
    },

    /**
     * Trigger the state
     */
    _triggerState: function () {
      this.trigger('state:change', {
        lat: this.options.center[0],
        lng: this.options.center[1],
        zoom: this.options.zoom
      });
    },

    /**
     * Remove all the layers concerning the data from the map
     */
    _removeDataLayers: function () {
      this.map.eachLayer(function (layer) {
        if (layer !== this.basemap) this.map.removeLayer(layer);
      }, this);
    },

    /**
     * Create the icon for a dot on the map
     */
    _createDotIcon: function () {
      return L.divIcon({
        className: 'dot',
        iconSize: [15, 15]
      });
    },

    /**
     * Get the content of the popup for a dot on the map
     * @param {object} data - data associated with the marker
     */
    _getPopupContent: function (data) {
      var index = data.index;
      var row = this.options.data[index];
      return '<div class="popup">' +
        Object.keys(row).map(function (key) {
          return '<div class="row"><span class="name">' + key + '</span><span class="value">' + row[key] + '</span></div>';
        }).join('') +
        '</div>';
    },

    /**
     * Render the dots on the map
     */
    _renderDots: function () {
      this.dots = new PruneClusterForLeaflet();

      // Icon for the cluster
      this.dots.BuildLeafletClusterIcon = function (cluster) {
        return L.divIcon({
          className: 'cluster',
          iconSize: [30, 30],
          html: '<span>' + (cluster.population > 99 ? '99+' : cluster.population) + '</span>'
        });
      };

      this.options.data.forEach(function (row, index) {
        var lat = row[this.options.fields.lat];
        var lng = row[this.options.fields.lng];
        var marker = new PruneCluster.Marker(lat, lng);
        marker.data.icon = this._createDotIcon;
        marker.data.popup = this._getPopupContent.bind(this);
        marker.data.index = index;
        // eslint-disable-next-line new-cap
        this.dots.RegisterMarker(marker);
      }, this);

      this.dots.addTo(this.map);
    },

    /**
     * Render the data on the map
     */
    _renderData: function () {
      this._removeDataLayers();

      if (this.options.type === 'dots') {
        if (!this.options.fields.lat || !this.options.fields.lng) {
          // eslint-disable-next-line no-console
          console.warn('The fields name to position the dots are needed');
          return;
        }
        this._renderDots();
      }

      // We save the state of the map each time we render as it can be the
      // consequence of a change in the configuration
      this._triggerState();
    },

    render: function () {
      if (this.map) {
        this.map.setView(this.options.center, this.options.zoom);
        this._removeDataLayers();
        this._renderData();
      } else {
        this.el.classList.add(this.className);

        this.map = L.map(this.el, this.options.mapOptions)
          .setView(this.options.center, this.options.zoom);

        this.basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(this.map);

        this._setListeners();
        this._renderData();
      }

      return this.el;
    }

  });
})(this.App));
