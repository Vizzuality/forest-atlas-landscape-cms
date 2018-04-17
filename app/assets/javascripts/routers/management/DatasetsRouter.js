((function (App) {
  'use strict';

  // This collection is used to display the table
  var TableCollection = Backbone.Collection.extend({
    parse: function (data) {
      var keys;
      if (data.length) keys = Object.keys(data[0]);
      var infoButton;
      console.log('edit site', data)
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
                sortable: row[key].sortable,
                visible: true
              };

            case /status/.test(key):
              return {
                name: key,
                value: App.Helper.Utils.toTitleCase(row[key].value),
                searchable: row[key].searchable,
                sortable: row[key].sortable,
                visible: true
              };

            case /connector/.test(key):
              return {
                name: key,
                value: row[key].value.toUpperCase(),
                searchable: row[key].searchable,
                sortable: row[key].sortable,
                visible: true
              };

            case /metadata/.test(key):
              // we copy the metadata into another column to display the info button
              infoButton = {
                name: '',
                is_metadata: true,
                value: JSON.stringify(row[key].value),
                visible: true
              };

              var values = [];
              if (row[key].value) {
                values = Object.keys(row[key].value)
                  .map(function (item) {
                    return row[key].value[item];
                  })
                  .filter(function (item) {
                    return item !== '';
                  });
              }

              return {
                name: key,
                value: values,
                searchable: row[key].searchable,
                sortable: row[key].sortable,
                visible: typeof row[key].visible !== 'undefined' ? row[key].visible : true
              };

            case /(enable|edit|delete|edit_metadata)/.test(key):
              // eslint-disable-next-line no-shadow
              var res = {
                name: null,
                searchable: false,
                visible: true
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
                sortable: row[key].sortable,
                visible: typeof row[key].visible !== 'undefined' ? row[key].visible : true
              };
          }
        });
        res.row.push(infoButton);

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
          { name: 'Widgets', url: '/management/sites/' + this.slug + '/widgets' },
          { name: 'Contexts', url: '/management/sites/' + this.slug + '/contexts' }
        ]
      });

      var tableCollection = new TableCollection(gon.datasets, { parse: true });
      var tableContainer = document.querySelector('.js-table');

      if (tableCollection.length === 0) {
        tableContainer.innerHTML = '<p class="no-data">There isn\'t any dataset to display yet.</p>';
      } else {
        // We initialize the table
        new App.View.TableView({
          el: tableContainer,
          collection: tableCollection,
          tableName: 'List of pages',
          searchFieldContainer: $('.js-table-search')[0]
        });
      }
    }
  });
})(this.App));
