((function (App) {
  'use strict';

  App.Router.FrontDashboard = Backbone.Router.extend({

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
    },

    _initCharts: function () {
      var dataset = (window.gon && gon.analysisData.data) || [];
      var charts = (window.gon && gon.analysisGraphs) || [{}, {}];

      new App.View.ChartWidgetView({
        el: document.querySelector('.js-chart-1'),
        data: dataset,
        chartConfig: App.Helper.ChartConfig,
        chart: charts[0].type || null,
        columnX: charts[0].x || null,
        columnY: charts[0].y || null
      });

      new App.View.ChartWidgetView({
        el: document.querySelector('.js-chart-2'),
        data: dataset,
        chartConfig: App.Helper.ChartConfig,
        chart: charts[1].type || null,
        columnX: charts[1].x || null,
        columnY: charts[1].y || null
      });
    },

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

    index: function () {

    }

  });
})(this.App));
