((function (App) {
  'use strict';

  // eslint-disable-next-line
  var JSON = {"padding": {"top": 10, "left": 0, "bottom": 30, "right": 0},"data":[{"name":"table","values":[{"x":1,"y":28},{"x":2,"y":55},{"x":3,"y":43},{"x":4,"y":91},{"x":5,"y":81},{"x":6,"y":53},{"x":7,"y":19},{"x":8,"y":87},{"x":9,"y":52},{"x":10,"y":48},{"x":11,"y":24},{"x":12,"y":49},{"x":13,"y":87},{"x":14,"y":66},{"x":15,"y":17},{"x":16,"y":27},{"x":17,"y":68},{"x":18,"y":16},{"x":19,"y":49},{"x":20,"y":15}]}],"scales":[{"name":"x","type":"ordinal","range":"width","domain":{"data":"table","field":"x"}},{"name":"y","type":"linear","range":"height","domain":{"data":"table","field":"y"},"nice":true}],"axes":[{"type":"x","scale":"x"},{"type":"y","scale":"y"}],"marks":[{"type":"rect","from":{"data":"table"},"properties":{"enter":{"x":{"scale":"x","field":"x"},"width":{"scale":"x","band":true,"offset":-1},"y":{"scale":"y","field":"y"},"y2":{"scale":"y","value":0}},"update":{"fill":{"value":"steelblue"}}}}]};

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
        json: JSON
      });

      new App.View.DashboardChartView({
        el: document.querySelector('.js-chart-2'),
        json: JSON
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
