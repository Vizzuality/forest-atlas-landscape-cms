((function (App) {
  'use strict';

  App.Router.FrontHomepage = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function () {
      // Instantiate the common views here for the page, use the "routes" object to instantiate
      // per route views
      new App.View.HeaderView({
        el: document.querySelector('.js-header')
      });

      // We instantiate the wysiwyg editor
      var content = document.querySelector('.js-json-content').value;
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content',
        serializedContent: content ? JSON.parse(content) : null,
        readOnly: true
      });
    },

    index: function () {

    }

  });
})(this.App));
