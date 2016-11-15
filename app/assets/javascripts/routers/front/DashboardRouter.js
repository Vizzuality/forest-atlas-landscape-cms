((function (App) {
  'use strict';

  /* This bit of code is temporal pending a refined architecture */

  // eslint-disable-next-line
  var dataset = [{"x":1,"y":28,"gender":"male"},{"x":2,"y":55,"gender":"female"},{"x":3,"y":43,"gender":"male"},{"x":4,"y":91,"gender":"male"},{"x":5,"y":81,"gender":"female"},{"x":6,"y":53,"gender":"female"},{"x":7,"y":19,"gender":"female"},{"x":8,"y":87,"gender":"female"},{"x":9,"y":52,"gender":"female"},{"x":10,"y":48,"gender":"male"},{"x":11,"y":24,"gender":"female"},{"x":12,"y":49,"gender":"female"},{"x":13,"y":87,"gender":"female"},{"x":14,"y":66,"gender":"female"},{"x":15,"y":17,"gender":"female"},{"x":16,"y":27,"gender":"male"},{"x":17,"y":68,"gender":"male"},{"x":18,"y":16,"gender":"male"},{"x":19,"y":49,"gender":"male"},{"x":20,"y":15,"gender":"female"}];

  var chartConfig = [
    {
      name: 'bar',
      acceptedStatTypes: [
        ['nominal', 'quantitative'],
        ['temporal', 'quantitative'],
        ['ordinal', 'quantitative']
      ]
    },
    {
      name: 'line',
      acceptedStatTypes: [
        ['temporal', 'quantitative'],
        ['ordinal', 'quantitative']
      ]
    },
    {
      name: 'pie',
      acceptedStatTypes: [
        ['nominal'],
        ['ordinal']
      ]
    },
    {
      name: 'scatter',
      acceptedStatTypes: [
        ['quantitative', 'quantitative'],
        ['nominal', 'nominal'],
        ['nominal', 'ordinal'],
        ['ordinal', 'ordinal']
      ]
    }
  ];

  /* End */

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
      new App.View.DashboardChartView({
        el: document.querySelector('.js-chart-1'),
        data: dataset,
        chartConfig: chartConfig,
        chart: 'bar'
      });

      new App.View.DashboardChartView({
        el: document.querySelector('.js-chart-2'),
        data: dataset,
        chartConfig: chartConfig,
        chart: 'scatter'
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
