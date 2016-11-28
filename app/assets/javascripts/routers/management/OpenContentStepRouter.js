((function (App) {
  'use strict';

  App.Router.ManagementOpenContentStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      // We instantiate the wysiwyg editor
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content'
      });

      $('.js-submit').on('click', function () {
        if (this.wysiwygView) this.wysiwygView.saveHTML();
      }.bind(this));
    }

  });
})(this.App));
