// = require ../../channels/preview

((function (App) {
  'use strict';

  App.View.PreviewButtonView = Backbone.View.extend({
    template: HandlebarsTemplates['admin/preview-button'],

    defaults: {
      siteSlug: null,
      compiling: false
    },

    events: {
      'click .preview-button': '_startCompiling'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      //App.Cable

      this.render();
    },

    /**
     * Event handler executed when the user clicks the add URL button
     */
    _startCompiling: function () {
      this.options.compiling = true;

      const vm = this;
      $.get(`${window.gon.global.api_url}/admin/sites/${this.options.siteSlug}/preview/compile`, function( data ) {
        vm.options.compiling = true;

        vm.render();
      });
    },

    _finished: function() {
      this.options.compiling = false;
    },

    render: function () {
      this.$el.html(this.template({
        compiling: this.options.compiling,
      }));
    }
  });
})(this.App));

