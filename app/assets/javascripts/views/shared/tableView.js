((function (App) {
  'use strict';

  var HeadersCollection = Backbone.Collection.extend({

    model: Backbone.Model.extend({

      /**
       * Return whether the header is searchable
       * @returns {Boolean}
       */
      isSearchable: function () {
        return this.attributes.searchable;
      },

      /**
       * Return whether the header is sortable
       * @returns {Boolean}
       */
      isSortable: function () {
        return this.attributes.sortable;
      }

    }),

    parse: function (data) {
      if (data.length) {
        return data[0].row
          .map(function (cell) {
            return {
              name: cell.name,
              searchable: !!cell.searchable,
              // For now, if a column is searchable, it is also sortable
              sortable: !!cell.searchable
            };
          });
      }

      return [];
    }

  });

  App.View.TableView = Backbone.View.extend({

    defaults: {
      // Number of results per page
      resultsPerPage: 10,
      // Current pagination index
      paginationIndex: 0,
      // Collection representing the table
      // Each row can contain the name of the column, the value of the cell or an html content, and
      // a attribute to tell if the column can be searchable / sortable
      // An example of the format can be:
      // [
      //   {
      //     row: [
      //       { name: 'Price', value: '$3', searchable: true },
      //       { name: null, html: '<button type="button">Delete</button>', searchable: false }
      //     ]
      //   }
      // ]
      collection: null,
      // List of headers
      // This is computed at instantiation, do not set it from outside
      headers: null,
      // Column index used for sorting the table
      sortColumnIndex: 0,
      // Sort order: 1 for ASC, -1 for DESC
      sortOrder: 1,
      // Table name used by screen readers
      tableName: null
    },

    template: HandlebarsTemplates['shared/table'],

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);

      if (!this.options.collection) {
        throw new Error('Please provide to the table component a collection to fetch.');
      }

      if (!this.options.tableName || !this.options.tableName.length) {
        throw new Error('Please provide a name to the table component.');
      }

      this.options.collection.fetch()
        .done(function () {
          this.options.headers = new HeadersCollection(this.options.collection.toJSON(), { parse: true });
          this._initSort();
          this.render();
        }.bind(this))
        .fail(function () {
          this.error = 'Unable to load the data for the table.';
          this.render();
        }.bind(this));
    },

    /**
     * Set global variables
     */
    _setVars: function () {
      this.$headers = this.$('.js-header > th');
    },

    /**
     * Set the listeners on the rendered DOM
     */
    _setListeners: function () {
      this.$('.js-header').on('click', function (e) {
        var column = e.target.textContent;
        if (column) this._sortTable(column);
      }.bind(this));

      this.$('.js-header').on('keydown', this._onKeydownHeader.bind(this));
    },

    /**
     * Listener for the key events on the header
     * @param {Object} event
     */
    _onKeydownHeader: function (e) {
      var currentHeaderIndex = this.$headers.index($(e.target));

      switch (e.keyCode) {
        case 13: // enter key
        case 32: // space key
          this._sortTable(e.target.textContent);
          this._focusOnHeaderAtIndex(currentHeaderIndex);
          break;

        case 37: // left arrow
        case 38: // top arrow
          var previousHeaderIndex = currentHeaderIndex;
          // We search for the previous sortable column's header
          do {
            previousHeaderIndex = (previousHeaderIndex - 1) % this.options.headers.length;
            if (previousHeaderIndex < 0) previousHeaderIndex = this.options.headers.length - 1;
          } while (!this.options.headers.at(previousHeaderIndex).isSortable());
          this._focusOnHeaderAtIndex(previousHeaderIndex);
          break;

        case 39: // right arrow
        case 40: // down arrow
          var nextHeaderIndex = currentHeaderIndex;
          // We search for the next sortable column's header
          do {
            nextHeaderIndex = (nextHeaderIndex + 1) % this.options.headers.length;
          } while (!this.options.headers.at(nextHeaderIndex).isSortable());
          this._focusOnHeaderAtIndex(nextHeaderIndex);
          break;

        default:
      }
    },

    /**
     * Focus on the header at the specified index
     * @param {Number} index
     */
    _focusOnHeaderAtIndex: function (index) {
      this.$headers.filter('[tabindex="0"]').attr('tabindex', '-1');
      this.$headers.eq(index)
        .attr('tabindex', '0')
        .focus();
    },

    /**
     * Set the comparator to the table's first column and sort the collection
     */
    _initSort: function () {
      this.options.collection.comparator = function (modelA, modelB) {
        var comparator = this.options.headers.at(this.options.sortColumnIndex).attributes.name;

        var cellA = _.findWhere(modelA.attributes.row, { name: comparator });
        var cellB = _.findWhere(modelB.attributes.row, { name: comparator });
        if (!cellA || !cellB) return 0; // Arbitrary value

        return cellA.value.localeCompare(cellB.value, [], { sensitivity: 'base' }) * this.options.sortOrder;
      }.bind(this);

      this.options.collection.sort();
    },

    /**
     * Sort the table ASC by the column the user clicked on or DESC if the table was already
     * sorted ASC by the same column
     * @param {String} columnName
     */
    _sortTable: function (columnName) {
      if (!columnName.length) return;

      var column = this.options.headers.find({ name: columnName });
      if (!column || !column.isSortable()) return;

      var columnIndex = this.options.headers.indexOf(column);
      if (this.options.sortColumnIndex === columnIndex) {
        this.options.sortOrder *= -1;
      } else {
        this.options.sortOrder = 1;
        this.options.sortColumnIndex = columnIndex;
      }

      this.options.collection.sort();
      this.render();
    },

    render: function () {
      var sortColumn = this.options.headers.at(this.options.sortColumnIndex).attributes.name;

      var headers;
      if (this.options.collection.length) {
        headers = this.options.headers.toJSON()
          .map(function (column) {
            var sort;
            if (column.name === sortColumn) {
              sort = this.options.sortOrder === 1 ? 'ascending' : 'descending';
            }

            return {
              name: column.name,
              sort: sort
            };
          }, this);
      }

      var rows = this.options.collection.toJSON()
        .map(function (row) { return row.row; });

      this.$el.html(this.template({
        tableName: this.options.tableName,
        headers: headers,
        rows: rows,
        sortColumn: sortColumn,
        sortOrder: this.options.sortOrder === 1 ? 'ascending' : 'descending',
        error: this.error
      }));

      this._setVars();
      this._setListeners();
    }

  });
})(this.App));
