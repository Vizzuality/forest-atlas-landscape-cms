((function (App) {
  'use strict';

  /* eslint-disable no-unused-vars */
  var OPEN_CONTENT = 1;
  var ANALYSIS_DASHBOARD = 2;
  var HOMEPAGE = 3;
  var MAP = 4;
  var LINK = 5;
  var STATIC_CONTENT = 6;
  /* eslint-enable no-unused-vars */

  App.Router.ManagementPageEdition = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
      this.pageId = params[1] || null;
    },

    _getPageType: function () {
      var input = document.querySelector('#site_page_content_type');
      return input && +input.value;
    },

    index: function () {
      var pageType = this._getPageType();

      if (pageType === OPEN_CONTENT || pageType === STATIC_CONTENT) {
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
