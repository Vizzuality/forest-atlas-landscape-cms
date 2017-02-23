((function (App){
  'use strict';

  App.View.HtmlBlockView = Backbone.View.extend({
    className: 'c-html-block',
    template: HandlebarsTemplates['management/html-block'],
    defaults: {},

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render = this.render.bind(this);
    },

    render: function () {
      this.el.innerHTML = this.template({
        content: this.options.content
      });
      return this;
    }
  });
})(this.App));
