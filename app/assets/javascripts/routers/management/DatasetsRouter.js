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
            case /tags/.test(key):
              return {
                name: key,
                value: row[key].value
                  .filter(function (tag) { return tag.length; })
                  .join(', '),
                searchable: row[key].searchable,
                sortable: row[key].sortable
              };

            case /status/.test(key):
              return {
                name: key,
                value: App.Helper.Utils.toTitleCase(row[key].value),
                searchable: row[key].searchable,
                sortable: row[key].sortable
              };

            case /connector/.test(key):
              return {
                name: key,
                value: row[key].value.toUpperCase(),
                searchable: row[key].searchable,
                sortable: row[key].sortable
              };

            case /(enable|edit|delete)/.test(key):
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
                if (method === 'delete') extraAttributes += ' data-confirm="Are you sure?"';
              }

              var label = key;
              if (key === 'enable' && row.enabled.value) {
                label = 'disable';
              }

              res.html = '<a href="' + row[key].value + '" class="c-table-action-button -' +
                label + '" title="' + App.Helper.Utils.toTitleCase(label) + '" ' + extraAttributes + '>' +
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

  App.Router.ManagementDatasets = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      // We initialize the tabs
      new App.View.TabView({
        el: $('.js-tabs'),
        redirect: true,
        currentTab: 2,
        tabs: [
          { name: 'Site\'s structure', url: '/management/sites/' + this.slug + '/structure' },
          { name: 'Pages', url: '/management/sites/' + this.slug + '/site_pages' },
          { name: 'Datasets', url: '/management/sites/' + this.slug + '/datasets' },
          { name: 'Widgets', url: '/management/sites/' + this.slug + '/widgets' }
        ]
      });

      // We initialize the table
      new App.View.TableView({
        el: $('.js-table'),
        collection: new TableCollection(gon.datasets, { parse: true }),
        tableName: 'List of pages',
        searchFieldContainer: $('.js-table-search')[0]
      });
    }
  });
})(this.App));
