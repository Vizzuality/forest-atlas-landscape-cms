((function (App) {
  'use strict';

  App.Router.ManagementPageEdition = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
      this.pageId = params[1] || null;
    },

    index: function () {
      // We instantiate the wysiwyg editor
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content'
      });

      // Before the form is submitted, we need to save the output HTML
      $('.js-submit').on('click', function () {
        this.wysiwygView.saveHTML();
      }.bind(this));
    }

  });
})(this.App));
