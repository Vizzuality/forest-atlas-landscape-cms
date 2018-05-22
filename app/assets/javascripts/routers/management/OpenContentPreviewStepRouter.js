((function (App) {
  'use strict';

  App.Router.ManagementOpenContentPreviewStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      // We instantiate the wysiwyg editor
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content',
        serializedContent: JSON.parse(document.querySelector('.js-json-content').value),
        readOnly: true
      });
    }

  });
})(this.App));
