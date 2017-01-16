((function (App) {
  'use strict';

  App.View.DatasetFiltersView = Backbone.View.extend({

    template: HandlebarsTemplates['management/dataset-filters'],
    collection: new Backbone.Collection(),

    defaults: {
      // List of fields
      // The format must follow these rules:
      //  * the type of the fields must be either "number", "string" or "date"
      //  * if the field is type "number" or "date", it must have a min and max attribute
      //  * if the field is type "string", it must have a list of the values
      // Here is an example:
      // [
      //   {
      //     "name": "age",
      //     "type": "number",
      //     "min": 10,
      //     "max": 20,
      //   },
      //   {
      //     "name": "year",
      //     "type": "date",
      //     "min": "10/01/2015",
      //     "max": "27/12/2015",
      //   },
      //   {
      //     "name": "name",
      //     "type": "string",
      //     "values": ["Tiago", "Clément"]
      //   }
      // ]
      fields: [],
      // Default filters
      filters: [],
      // API endpoint to fetch the table extract
      endpointUrl: '',
      hiddenInputName: '',
      // State of the default filters
      defaultFilter: {
        name: null,
        type: null,
        variable: false
      },
      // Whether the filters can be variable or not
      canBeVariable: true
    },

    events: {
      'click .js-add-filter': '_onClickAddFilter',
      'click .js-remove-filter': '_onClickRemoveFilter',
      'change .js-field': '_onChangeField',
      'change .js-from-value': '_onChangeFromToValue',
      'change .js-to-value': '_onChangeFromToValue',
      'change .js-values': '_onChangeValues',
      'change .js-variable': '_onUpdateVariable',
      'click .js-preview': '_onClickPreview'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this._restoreFilters();
      this._addFilter(); // Add a default filter and render
      this.activeRequestsCount = 0; // Number of active requests to get the table extract
    },

    /**
     * Event handler called when the user clicks the "Add filter" button
     */
    _onClickAddFilter: function () {
      this._addFilter();
    },

    /**
     * Event handler called when the user clicks the "Remove filter" button
     * @param {object} e - event object
     */
    _onClickRemoveFilter: function (e) {
      var index = +$(e.target).data('id');
      var model = this.collection.at(index);
      this.collection.remove(model);
      this.render();
    },

    /**
     * Event handler called when the user changes the field of a filter
     * @param {object} e - event object
     */
    _onChangeField: function (e) {
      var value = e.target.value;
      var position = +e.target.dataset.id;
      var model = this.collection.at(position);
      model.set({
        name: value,
        type: _.findWhere(this.options.fields, { name: value }).type
      });
      this.render();
    },

    /**
     * Event handler called when the "from" or "to" value of a filter is changed
     * @param {object} e - object event
     */
    _onChangeFromToValue: function (e) {
      var selector = e.target;
      var index = +selector.dataset.id;
      var model = this.collection.at(index);
      var value = model.get('type') === 'date' ? selector.value : +selector.value;
      var selectorType = selector.dataset.selectorType;
      var o = {};
      o[selectorType] = model.get('type') === 'date' ? App.Helper.Utils.parseUTCDate(value) : value;
      model.set(o);

      // We need to render to disable some values of the "to" selector
      this.render();
    },

    /**
     * Event handler called when the selected values of a string filter are changed
     */
    _onChangeValues: function (e) {
      var selector = e.target;
      var index = +selector.dataset.id;
      var model = this.collection.at(index);
      var selectedOptions = Array.prototype.slice.call(selector.selectedOptions);
      var values = selectedOptions.map(function (option) {
        return option.value;
      });
      model.set({ values: values });
      this.render();
    },

    /**
     * Event handler called when the variable attribute of a filter is changed
     */
    _onUpdateVariable: function (e) {
      var value = !!+e.target.value;
      var position = +e.target.dataset.id;
      var model = this.collection.at(position);
      model.set({ variable: value });
      this.render();
    },

    /**
     * Event handler called when the user clicks the "Preview table" button
     */
    _onClickPreview: function () {
      if (this.previewTimer) return;

      if (!this.previewModal) {
        this.previewModal = new (App.View.ModalView.extend({
          render: this._renderPreviewTable.bind(this) // eslint-disable-line no-extra-bind
        }))();
      }

      if (this.activeRequestsCount === 0) {
        this.previewModal.open();
      } else {
        var notificationId = App.notifications.broadcast(App.Helper.Notifications.page.datasetPreview);

        this.previewTimer = setInterval(function () {
          if (this.activeRequestsCount === 0) {
            clearInterval(this.previewTimer);
            this.previewTimer = null;
            App.notifications.hide(notificationId);
            this.previewModal.open();
          }
        }.bind(this), 200);
      }
    },

    /**
     * Restore the default filters if exist
     */
    _restoreFilters: function () {
      if (!this.options.filters) return;
      var defaultFilter = this.options.defaultFilter;
      this.collection.reset(this.options.filters.map(function (filter) {
        var o = Object.assign({}, defaultFilter, filter, { name: filter.name });
        if (o.from) o.from = +o.from;
        if (o.to) o.to = +o.to;
        if (o.values) o.values = o.values.split(',');
        return o;
      }));
    },

    /**
     * Render the table into a string and return it
     * @returns {string} HTML
     */
    _renderPreviewTable: function () {
      var tableRows = (this.tableExtract && this.tableExtract.rows) || [];

      if (!tableRows.length) {
        return '<div class="c-table"><div class="table-legend"><p>No results were found</p></div></div>';
      }

      var res = '<div class="c-table"><table><tr class="header">';
      res += this.options.fields.map(function (field) {
        return '<th>' + field.name + '</th>';
      }).join('');
      res += '</tr>';
      res += tableRows.map(function (row) {
        return '<tr>' +
          Object.keys(row).map(function (field) {
            return '<td>' + row[field] + '</td>';
          }).join('') +
          '</tr>';
      }).join('');
      res += '</table>';
      res += '<div class="table-legend"><p>Table preview shows only 10 first rows</p></div>';
      res += '</div>';
      return res;
    },

    /**
     * Add a filter with the default options
     */
    _addFilter: function () {
      this.collection.push(this.options.defaultFilter);
      this.render();
    },

    /**
     * Return the step precision between two values
     * The default step is 1, but if the min and max are close, the step is smaller
     * @param {number} min
     * @param {number} max
     * @returns {number} step
     */
    _getStepPrecision: function (min, max) {
      // eslint-disable-next-line no-nested-ternary
      return (max - min <= 2) ? 0.1 : ((max - min <= 10) ? 0.5 : 1);
    },

    /**
     * Enhance the selectors by initialising Select2 on the selects, and Jquery UI Datepicker on the
     * inputs with type date
     */
    _enhanceSelectors: function () {
      this.$el.find('select').select2({
        width: 'off' // Auto width
      });

      var dateInputs = document.querySelectorAll('input[type=date]');
      Array.prototype.slice.call(dateInputs).forEach(function (input) {
        $(input).datepicker({
          changeMonth: true,
          changeYear: true,
          minDate: input.dataset.min,
          maxDate: input.dataset.max
        });
      });
    },

    /**
     * Return the list of fields not used for the filtering
     * NOTE: a field is considered as "used" when it has been selected on the screen, that
     * does not mean it is actually filtered
     * @returns {object[]} fields
     */
    _getUnusedFields: function () {
      return this.options.fields.filter(function (field) {
        var filter = _.findWhere(this.collection.toJSON(), { name: field.name });
        return !filter;
      }, this);
    },

    /**
     * Return whether one of the filter isn't link to any column yet
     * @returns {boolean} unspecifiedFilter
     */
    _isThereUnspecifiedFilter: function () {
      return this.collection.toJSON().reduce(function (res, filter) {
        return res || !filter.name;
      }, false) || false;
    },

    /**
     * Return the list of serialized filters
     * NOTE: filters non associated to a field are removed
     * @returns {string} serializedFilters
     */
    _getSerializeFilters: function () {
      var serializedFilters = this.collection.toJSON().map(function (filter) {
        var res = Object.assign({}, filter);
        if (res.values) res.values = res.values.join(',');
        delete res.type;
        return res;
      }).filter(function (filter) {
        return filter.name;
      });

      return JSON.stringify(serializedFilters);
    },

    /**
     * Get the URL to fetch the filtered table extract
     * @returns {string} url
     */
    _getTableExtractURL: function () {
      return this.options.endpointUrl +
      this.collection.toJSON().map(function (filter) {
        var res = Object.assign({}, filter);
        delete res.type;
        return res;
      }).filter(function (filter) {
        return filter.name;
      }).reduce(function (res, filter, index) {
        var serializedFilter = Object.keys(filter).reduce(function (str, key) {
          var name = key;

          var value = filter[key];
          if (value instanceof Date) {
            value = value.toISOString();
          }

          return str + (str.length ? '&' : '') + 'filters[' + index + '][' + name + ']=' + value;
        }, '');

        return res + (res.length ? '&' : '?') + serializedFilter;
      }, '');
    },

    /**
     * Return a deferred object to fetch an extract of the filtered table
     * @returns {object} $.Deferred
     */
    _getTableExtract: function () {
      // TODO query number
      var deferred = $.Deferred(); // eslint-disable-line new-cap
      var collection = new (Backbone.Collection.extend({
        url: this._getTableExtractURL()
      }))();

      collection.fetch()
        .done(function (data) { deferred.resolve(data); })
        .fail(function () { deferred.reject(); });

      return deferred;
    },

    /**
     * Fetch the table extract, save the result to global variables and return a deferred
     * object
     * NOTE: the reject case means the request is not up-to-date
     * @returns {object} $.Deferred
     */
    _fetchTableExtract: (function () {
      var requestsCount = 0; // eslint-disable-line no-unused-vars
      return function () {
        // The ID is used to unsure the data correspond to the *last* query
        var id = ++requestsCount;
        this.activeRequestsCount++;
        var deferred = $.Deferred(); // eslint-disable-line new-cap
        this._getTableExtract()
          .done(function (data) {
            if (id === requestsCount) this.tableExtract = data;
          }.bind(this)).fail(function () {
            if (id === requestsCount) this.tableExtract = null;
          }.bind(this)).always(function () {
            this.activeRequestsCount--;
            if (id === requestsCount) deferred.resolve();
            else deferred.reject();
          }.bind(this));

        return deferred;
      };
    }()),

    /**
     * Update the row count with the result of the query to the server
     */
    _checkRowCount: function () {
      this.countEl = this.el.querySelector('.js-row-count');
      if (this.collection.toJSON().length) {
        this.countEl.classList.add('c-loading-spinner');
        this._updateRowCount();
      } else {
        this.countEl.classList.remove('c-loading-spinner');
      }
    },

    /**
     * Get the row count with the result of the query to the server
     */
    _updateRowCount: _.debounce(function () {
      this._fetchTableExtract()
        .done(function () {
          var count = this.tableExtract && this.tableExtract.count;
          count = (count !== null && count !== undefined) ? (count.toLocaleString('en-US') + ' rows') : '';
          this.countEl.classList.remove('c-loading-spinner');
          this.countEl.textContent = count;
        }.bind(this));
    }, 1500),

    render: function () {
      var filters = this.collection.toJSON().map(function (filter, index) {
        // We combine the attributes of the filter with the one of the selected field
        // (if selected) so we get the min value, max value and/or list of possible values for
        // the filter
        var field = {};
        if (filter.name) {
          field = _.findWhere(this.options.fields, { name: filter.name });

          // If we have a min and max value and the field is type number, we want to compute
          // the step precision between the two values
          if (field.min !== null && field.max !== null && field.type === 'number') {
            field.step = this._getStepPrecision(field.min, field.max);
          }
        }

        // We add an index to the final object, and rename the "values" property of the filter
        // objet by "selectedValues"
        var o = { id: index + 1 };
        if (filter.values) o.selectedValues = filter.values;

        return Object.assign({}, filter, field, o);
      }, this);

      this.$el.html(this.template({
        fields: this._getUnusedFields(),
        filters: filters,
        json: this._getSerializeFilters(),
        canAddNewField: !!this._getUnusedFields().length && !this._isThereUnspecifiedFilter(),
        canBeVariable: this.options.canBeVariable,
        hiddenInputName: this.options.hiddenInputName
      }));
      this.setElement(this.el);

      this._enhanceSelectors();

      if (this.options.endpointUrl && this.options.endpointUrl.length) {
        this._checkRowCount();
      }
    }
  });
})(this.App));
