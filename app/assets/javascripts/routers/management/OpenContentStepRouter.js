((function (App) {
  'use strict';

  App.Router.ManagementOpenContentStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;

      if (gon && gon.widgets) {
        this.widgets = gon.widgets.map(function (chart) {
          var vis = JSON.parse(chart.visualization);
          if (vis.type !== 'chart') {
            vis = Object.assign({}, vis, { type: 'chart', chart: vis.type});
          }
          chart.visualization =  JSON.stringify(vis);
          return chart;
        });
      }
    },

    index: function () {
      var serializedContent = document.querySelector('.js-json-content').value;

      // We instantiate the wysiwyg editor
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content',
        serializedContent: serializedContent.length ? JSON.parse(serializedContent) : null,
        widgets: this.widgets
      });

      $('.js-form').on('submit', function () {
        if (this.wysiwygView) {
          var content = this.wysiwygView.getSerializedContent();
          document.querySelector('.js-json-content').value = JSON.stringify(content);
        }
      }.bind(this));
    }

  });
})(this.App));
