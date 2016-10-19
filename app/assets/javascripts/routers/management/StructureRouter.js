((function (App) {
  'use strict';

  App.Router.ManagementStructure = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      // We initialize the site switcher
      new App.View.SiteSwitcherView({
        el: $('.js-site-switcher'),
        urlFormat: '/management/sites/:slug/structure'
      });

      // We initialize the tabs
      new App.View.TabView({
        el: $('.js-tabs'),
        redirect: true,
        currentTab: 0,
        tabs: [
          { name: 'Site\'s structure', url: '/management/sites/' + this.slug + '/structure' },
          { name: 'Pages', url: '/management/sites/' + this.slug + '/site_pages' },
          { name: 'Widgets', url: '/management/sites/' + this.slug + '/widgets' }
        ]
      });

      // We build the tree structure of the site
      new App.View.TreeStructureView({
        el: $('.js-tree'),
        collection: window.gon ? gon.structure : []
      });
    }

  });
})(this.App));
