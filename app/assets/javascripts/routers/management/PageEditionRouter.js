((function (App) {
  'use strict';

  var OPEN_CONTENT = 1;
  var ANALYSIS_DASHBOARD = 2;
  var DYNAMIC_INDICATOR = 3;
  var LINK = 6;
  var STATIC_CONTENT = 7;

  App.Router.ManagementPageEdition = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
      this.pageId = params[1] || null;
    },

    _getPageType: function () {
      var type_input = document.querySelector('#site_page_content_type');
      return type_input != null ? parseInt(type_input.value) : null;
    },

    index: function () {
      var pageType = this._getPageType();

      if (pageType === OPEN_CONTENT) {
        // We instantiate the wysiwyg editor
        this.wysiwygView = new App.View.WysiwygView({
          el: '.js-content'
        });
      }

      // Before the form is submitted, we need to save the output HTML
      $('.js-submit').on('click', function () {
        if (this.wysiwygView) {
          this.wysiwygView.saveHTML();
        }

        var form = document.querySelector('.js-form');
        if (form) form.submit();
      }.bind(this));
    }
  });
})(this.App));
