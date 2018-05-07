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
      var content = document.querySelector('.js-json-content').value;
      // We instantiate the wysiwyg editor
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content',
        serializedContent: content ? JSON.parse(content) : {},
        readOnly: true
      });
    }

  });
})(this.App));
