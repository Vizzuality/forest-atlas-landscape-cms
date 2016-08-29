((function (App) {
  'use strict';

  // This collection is used to display the table
  var TableCollection = Backbone.Collection.extend({
    url: window.location + '.json',

    parse: function (data) {
      return data.map(function (row) {
        return {
          row: [
            { name: 'Title', value: row.name, searchable: true },
            { name: 'Description', value: row.description, searchable: true },
            { name: 'URL', value: row.url, searchable: true },
            // TODO: attach the real icons and add the real links
            { name: null, html: '<a href="">Show</a>', searchable: false },
            { name: null, html: '<a href="">Edit</a>', searchable: false },
            { name: null, html: '<a href="">Delete</a>', searchable: false }
          ]
        };
      });
    }
  });

  App.Router.ManagementPages = Backbone.Router.extend({

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
        slug: this.slug
      });

      // We initialize the tabs
      new App.View.TabView({
        el: $('.js-tabs'),
        redirect: true,
        currentTab: 1,
        tabs: [
          { name: 'Site\'s structure', url: '/management/sites/' + this.slug + '/structure' },
          { name: 'Pages', url: '/management/sites/' + this.slug + '/site_pages' }
          // { name: 'Widgets', url: '/management/sites/' + this.slug + '/widgets' }
        ]
      });

      // We initialize the table
      new App.View.TableView({
        el: $('.js-table'),
        collection: new TableCollection(),
        tableName: 'List of pages'
      });
    }

  });
})(this.App));
