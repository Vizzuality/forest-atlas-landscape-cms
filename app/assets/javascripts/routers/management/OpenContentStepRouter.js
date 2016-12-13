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
      var serializedContent = document.querySelector('.js-json-content').value;

      // We instantiate the wysiwyg editor
      this.wysiwygView = new App.View.WysiwygView({
        el: '.js-content',
        serializedContent: serializedContent.length ? JSON.parse(serializedContent) : null
      });

      $('.js-submit').on('click', function () {
        if (this.wysiwygView) {
          var content = this.wysiwygView.getSerializedContent();
          document.querySelector('.js-json-content').value = JSON.stringify(content);
        }
      }.bind(this));
    }

  });
})(this.App));
