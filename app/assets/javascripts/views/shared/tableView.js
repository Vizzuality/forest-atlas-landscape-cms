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
              sortable: !!cell.sortable
            };
          });
      }

      return [];
    }

  });

  App.View.TableView = Backbone.View.extend({

    defaults: {
      // Number of results per page
      // TODO: implement the feature
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
      // NOTE: the collection will be added a comparator function and methods
      collection: null,
      // List of headers
      // This is computed at instantiation, do not set it from outside
      headers: null,
      // Column index used for sorting the table
      sortColumnIndex: 0,
      // Sort order: 1 for ASC, -1 for DESC
      sortOrder: 1,
      // Table name used by screen readers
      tableName: null,
      // Search field: must be a empty div DOM element with class "c-input-search" (to get the styles)
      // If let to null, the search feature will be disabled
      searchFieldContainer: null,
      // Search query. Do not set from outside.
      searchQuery: null,
      // Number of values displayed by cell
      // Once the number is reached, a button lets the user see the rest of the list
      valuesPerCell: 15
    },

    template: HandlebarsTemplates['shared/table'],
    modalTemplate: HandlebarsTemplates['shared/table-modal'],

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);

      if (!this.options.collection) {
        throw new Error('Please provide to the table component a collection to fetch.');
      }

      if (!this.options.tableName || !this.options.tableName.length) {
        throw new Error('Please provide a name to the table component.');
      }

      // Callback executed when the collection has data
      var done = function () {
        this.options.headers = new HeadersCollection(this.options.collection.toJSON(), { parse: true });
        this._initSort();
        if (this.options.searchFieldContainer) this._initSearch();
        this.render();
      };

      if (this.options.collection.length > 0) {
        done.call(this);
      } else if (!this.options.collection.url) {
        // eslint-disable-next-line no-console
        console.warn('The table has been instanciated with an empty collection and no url to fetch the data has been provided.');
        return;
      } else {
        this.options.collection.fetch()
          .done(done.bind(this))
          .fail(function () {
            this.error = 'Unable to load the data for the table.';
            this.render();
          }.bind(this));
      }
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

      this.$('.js-more').on('click', this._onClickMore.bind(this));
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
     * Listener for the click on the "and more" buttons
     * @param {Event} e - event
     */
    _onClickMore: function (e) {
      var tooltipContainer = e.target;
      var title = App.Helper.Utils.toTitleCase(tooltipContainer.dataset.name);
      var values = tooltipContainer.dataset.values.split(',');

      var modal = new (App.View.ModalView.extend({
        render: function () {
          return this.modalTemplate({
            title: title,
            values: values
          });
        }.bind(this)
      }))();

      modal.open();
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

        var valA = Array.isArray(cellA.value) ? cellA.value[0] : cellA.value;
        var valB = Array.isArray(cellB.value) ? cellB.value[0] : cellB.value;

        if ((valA === undefined || valA === null) && (valB === undefined || valB === null)) {
          return 0;
        } else if ((valA === undefined || valB === null) && valB) {
          return -1 * this.options.sortOrder;
        } else if (valA && (valB === undefined || valB === null)) {
          return 1 * this.options.sortOrder;
        }

        return valA.localeCompare(valB, [], { sensitivity: 'base' }) * this.options.sortOrder;
      }.bind(this);

      this.options.collection.sort();
    },

    /**
     *  Adds a search input and a submit button into the searchField container
     */
    _initSearch: function () {
      var searchField = document.createElement('input');
      searchField.setAttribute('type', 'input');
      searchField.setAttribute('placeholder', 'Search');

      var searchButton = document.createElement('button');
      searchButton.textContent = 'Search';

      // We attach the event listeners
      searchField.addEventListener('input', function (e) {
        this._search(e.target.value);
      }.bind(this));
      searchButton.addEventListener('click', function () {
        this._search(searchField.value);
      }.bind(this));

      // We bind the elements to the DOM
      this.options.searchFieldContainer.innerHTML = ''; // We make sure the container is empty
      this.options.searchFieldContainer.appendChild(searchField);
      this.options.searchFieldContainer.appendChild(searchButton);

      // We modify the toJSON method to take into account the search query
      this.options.collection.toJSON = function (options) {
        var collection = Backbone.Collection.prototype.toJSON.call(this.options.collection, options);
        if (!this.options.searchQuery || !this.options.searchQuery.length) return collection;

        // Each time, we need to recreate an instance of Fuse to maintain the sorting of the table
        var searchableColumns = this.options.headers.toJSON()
          .filter(function (header) { return header.searchable; })
          .map(function (header) { return header.name; });

        // We need to format the data for Fuse
        // The basic idea is that Fuse has a direct access to the searchable columns and their value.
        // We maintain a reference to the original row so we can display it later
        // Example of the format:
        // [
        //   {
        //     row: [
        //      { name: 'Title', value: 'Vizzuality' },
        //      { name: 'Price', value: '100€' }
        //     ],
        //     Title: 'Vizzuality',
        //     Price: '100€'
        //   }
        // ]
        var fuseCollection = collection.map(function (row) {
          var o = {};
          o.row = row;
          for (var i = 0, j = searchableColumns.length; i < j; i++) {
            var value = _.findWhere(row.row, { name: searchableColumns[i] }).value;
            o[searchableColumns[i]] = value;
          }
          return o;
        });

        this.options.collection.fuse = new Fuse(fuseCollection, {
          include: ['matches'],
          keys: searchableColumns,
          tokenize: true,
          threshold: 0,
          shouldSort: false
        });

        var searchResults = this.options.collection.fuse.search(this.options.searchQuery);

        return searchResults.map(function (result) {
          return result.item.row;
        });
      }.bind(this);
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

    /**
     * Render the table with the result of the search
     * @param {String} query
     */
    _search: function (query) {
      this.options.searchQuery = query;
      this.render();
    },

    /**
     * Return the list of rows, ready for being rendered
     * @returns {object[]} rows
     */
    _getRenderableRows: function () {
      return this.options.collection.toJSON()
        .map(function (row) {
          return row.row;
        });
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

      this.$el.html(this.template({
        tableName: this.options.tableName,
        headers: headers,
        rows: this._getRenderableRows(),
        sortColumn: sortColumn,
        sortOrder: this.options.sortOrder === 1 ? 'ascending' : 'descending',
        error: this.error,
        isSearchResult: this.options.searchQuery && !!this.options.searchQuery.length,
        valuesPerCell: this.options.valuesPerCell
      }));

      this._setVars();
      this._setListeners();
    }

  });
})(this.App));
