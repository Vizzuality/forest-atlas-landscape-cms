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

            case /chart/.test(key):
              var chart = '';
              try {
                var chartConfig = JSON.parse(row[key].value);
                chart = App.Helper.Utils.toTitleCase(chartConfig.type);
              } catch (e) {} // eslint-disable-line no-empty

              return {
                name: key,
                value: chart,
                searchable: row[key].searchable,
                sortable: row[key].sortable
              };

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

  App.Router.ManagementWidgets = Backbone.Router.extend({

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
        urlFormat: '/management/sites/:slug/widgets',
        slug: this.slug
      });

      // We initialize the tabs
      new App.View.TabView({
        el: $('.js-tabs'),
        redirect: true,
        currentTab: 3,
        tabs: [
          { name: 'Site\'s structure', url: '/management/sites/' + this.slug + '/structure' },
          { name: 'Datasets', url: '/management/sites/' + this.slug + '/datasets' },
          { name: 'Pages', url: '/management/sites/' + this.slug + '/site_pages' },
          { name: 'Widgets', url: '/management/sites/' + this.slug + '/widgets' }
        ]
      });

      var tableCollection = new TableCollection(gon.widgets, { parse: true });
      var tableContainer = $('.js-table');

      if (tableCollection.length === 0) {
        tableContainer.append('<p class="no-data">There isn\'t any widget to display yet.</p>');
      } else {
        // We initialize the table
        new App.View.TableView({
          el: tableContainer,
          collection: tableCollection,
          tableName: 'List of widgets',
          searchFieldContainer: $('.js-table-search')[0],
          sortColumnIndex: 1
        });

        // We attach a dialog notification to the delete buttons
        $('.js-confirm').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation(); // Prevents rails to automatically delete the widget

          App.notifications.broadcast(Object.assign({},
            App.Helper.Notifications.widget.deletion,
            {
              continueCallback: function () {
                $.rails.handleMethod($(e.target));
              }
            }
          ));
        });
      }
    }

  });
})(this.App));
