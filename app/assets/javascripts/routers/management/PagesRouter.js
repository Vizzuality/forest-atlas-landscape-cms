((function (App) {
  'use strict';

  // This collection is used to display the table
  var TableCollection = Backbone.Collection.extend({
    parse: function (data) {
      var keys;
      if (data.length) keys = Object.keys(data[0]);

      return data.map(function (row) {
        var res = {};

        res.row = keys.map(function (key) {
          switch (true) {
            case /enabled/.test(key):
              return {};

            case /(enable|edit|delete)/.test(key):
              if (!row[key].value) return '';

              // eslint-disable-next-line no-shadow
              var res = {
                name: null,
                searchable: false
              };

              // We need extra attributes when making a put or delete request
              var extraAttributes = '';
              var method = row[key].method;
              if (method === 'delete' || method === 'put') {
                extraAttributes = 'rel="nofollow" data-method="' + method + '"';
              }

              var label = key;
              if (key === 'enable' && row.enabled.value) {
                label = 'disable';
              }

              res.html = '<a href="' + row[key].value + '" class="c-table-action-button -' +
                label + ((method === 'delete') ? ' js-confirm' : '') +
                '" title="' + App.Helper.Utils.toTitleCase(label) + '" ' + extraAttributes + '>' +
                App.Helper.Utils.toTitleCase(label) + '</a>';

              return res;

            default:
              return {
                name: key,
                value: row[key].value,
                searchable: row[key].searchable,
                sortable: row[key].sortable
              };
          }
        });

        return res;
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
        currentTab: 2,
        tabs: [
          { name: 'Site\'s structure', url: '/management/sites/' + this.slug + '/structure' },
          { name: 'Datasets', url: '/management/sites/' + this.slug + '/datasets' },
          { name: 'Pages', url: '/management/sites/' + this.slug + '/site_pages' },
          { name: 'Widgets', url: '/management/sites/' + this.slug + '/widgets' }
        ]
      });

      // We initialize the table
      new App.View.TableView({
        el: $('.js-table'),
        collection: new TableCollection(gon.pages, { parse: true }),
        tableName: 'List of pages',
        searchFieldContainer: $('.js-table-search')[0],
        sortColumnIndex: 1
      });

      // We attach a dialog notification to the delete buttons
      $('.js-confirm').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // Prevents rails to automatically delete the page

        App.notifications.broadcast(Object.assign({},
          App.Helper.Notifications.page.deletion,
          {
            continueCallback: function () {
              $.rails.handleMethod($(e.target));
            }
          }
        ));
      });
    }

  });
})(this.App));
