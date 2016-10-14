((function (App) {
  'use strict';

  App.Router.ManagementPageCreation = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    /**
     * Return true if the editor should be instantiated base on whether the
     * query params
     * @returns {boolean}
     */
    _shouldInitEditor: function () {
      return /\?type=[0-9]/.test(window.location.search);
    },

    index: function () {
      // We initialize the site switcher
      new App.View.SiteSwitcherView({
        el: $('.js-site-switcher'),
        urlFormat: '/management/sites/:slug/site_pages/new' + window.location.search,
        slug: this.slug
      });

      if (this._shouldInitEditor()) {
        // We instantiate the wysiwyg editor
        this.wysiwygView = new App.View.WysiwygView({
          el: '.js-content'
        });

        // Before the form is submitted, we need to save the output HTML
        $('.js-submit').on('click', function () {
          this.wysiwygView.saveHTML();
        }.bind(this));
      }
    }

  });
})(this.App));
