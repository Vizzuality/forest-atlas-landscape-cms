((function (App) {
  'use strict';

  var OPEN_CONTENT = 1;
  var ANALYSIS_DASHBOARD = 2;
  var DYNAMIC_INDICATOR = 3;
  var LINK = 6;
  var STATIC_CONTENT = 7;

  App.Router.ManagementPageCreation = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    _getPageType: function () {
      var matches = location.search.match(/type=([0-9])$/);
      return matches && matches.length > 1 ? +matches[1] : null;
    },

    index: function () {
      var pageType = this._getPageType();

      // We initialize the site switcher
      new App.View.SiteSwitcherView({
        el: $('.js-site-switcher'),
        urlFormat: '/management/sites/:slug/site_pages/new' + window.location.search,
        slug: this.slug
      });

      if (pageType === OPEN_CONTENT) {
        // We instantiate the wysiwyg editor
        this.wysiwygView = new App.View.WysiwygView({
          el: '.js-content',
          defaultBlocks: ['Title', 'Introduction']
        });
      }

      if (pageType === OPEN_CONTENT || pageType === LINK) {
        $('.js-submit').on('click', function () {
          if (this.wysiwygView) this.wysiwygView.saveHTML();

          var form = document.querySelector('.js-form');
          if (form) form.submit();
        }.bind(this));
      }
    }

  });
})(this.App));
