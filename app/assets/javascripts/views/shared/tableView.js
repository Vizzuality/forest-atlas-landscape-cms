((function (App) {
  'use strict';

  App.View.TableView = Backbone.View.extend({

    defaults: {
      // Number of results per page
      resultsPerPage: 10,
      // Current pagination index
      paginationIndex: 0,
      // Collection representing the table
      // Each row can contain the name of the column, the value of the cell or an html content, and
      // a attribute to tell if the column can be searchable
      // An example of the format can be:
      // [
      //   {
      //     row: [
      //       { name: 'Price', value: '$3', searchable: true },
      //       { name: null, html: '<button type="button">Delete</button>', searchable: false }
      //     ]
      //   }
      // ]
      collection: null
    },

    template: HandlebarsTemplates['shared/table'],

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);

      if (!this.options.collection) {
        throw new Error('Please provide to the table component a collection to fetch.');
      }

      this.options.collection.fetch()
        .done(this.render.bind(this))
        .fail(function () {
          this.error = 'Unable to load the data for the table.';
          this.render();
        }.bind(this));
    },

    render: function () {
      var headers;
      if (this.options.collection.length) {
        headers = this.options.collection.toJSON()[0].row
          .map(function (cell) { return cell.name; });
      }

      var rows = this.options.collection.toJSON()
        .map(function (row) { return row.row; });

      this.$el.html(this.template({
        headers: headers,
        rows: rows,
        error: this.error
      }));
    }

  });
})(this.App));
