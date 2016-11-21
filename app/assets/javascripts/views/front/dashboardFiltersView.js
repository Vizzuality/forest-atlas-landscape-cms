((function (App) {
  'use strict';

  App.View.DashboardFiltersView = Backbone.View.extend({

    template: HandlebarsTemplates['front/dashboard-filters'],

    defaults: {
      // Original dataset
      data: [],
      // Fields that can be used to filter
      filteringFields: [],
      // Internal, dataset after the filters were applied
      _filteredData: [],
      // Internal, list of filters with their values
      // Example:
      // [
      //   { name: 'Filter 1', value: 'a', values: [ 'a', 'b', 'c' ] }
      // ]
      // NOTE: the values are sorted
      _filters: []
    },

    events: {
      'change .js-filter': '_onChangeFilter'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      // eslint-disable-next-line no-underscore-dangle
      this.options._filteredData = this._copyDataset(this.options.data);
      this._initFilters();
      this.render();
    },

    /**
     * Event handler for a filter change
     * @param {object} e - event object
     */
    _onChangeFilter: function (e) {
      var id = +e.target.dataset.id;
      var value = e.target.selectedOptions[0].value;

      // If the user reset the filter, we set its value to null
      if (!value.length) {
        // eslint-disable-next-line no-underscore-dangle
        this.options._filters[id].value = null;
        this._updateFilteredDataset();
        return;
      }

      // If the values are numbers, we convert the selected option's value to
      // a number too otherwise it will give us some issues with the filtering
      // eslint-disable-next-line no-underscore-dangle
      if (typeof this.options._filters[id].values[0] === 'number') {
        value = +value;
      }

      // eslint-disable-next-line no-underscore-dangle
      this.options._filters[id].value = value;
      this._updateFilteredDataset();
    },

    /**
     * Update the filtered dataset according to the current filters
     */
    _updateFilteredDataset: function () {
      // eslint-disable-next-line no-underscore-dangle
      var activeFilters = this.options._filters
        .filter(function (filter) {
          return !!filter.value;
        });

      // eslint-disable-next-line no-underscore-dangle
      this.options._filteredData = this._copyDataset(this.options.data)
        .filter(function (row) {
          return activeFilters.reduce(function (res, filter) {
            return res && (row[filter.name] === filter.value);
          }, true);
        });

      // Everytime the filtered dataset is updated, we trigger it
      this._triggerDataset();
    },

    /**
     * Trigger the filter dataset
     */
    _triggerDataset: function () {
      // eslint-disable-next-line no-underscore-dangle
      this.trigger('filters:change', this.options._filters.map(function (filter) {
        return {
          name: filter.name,
          value: filter.value
        };
      }).filter(function (filter) {
        return !!filter.value;
      }));
      // eslint-disable-next-line no-underscore-dangle
      this.trigger('dataset:change', this.options._filteredData);
    },

    /**
     * Returns a copy of a dataset
     * @param {object[]} dataset - dataset to copy
     * @returns { object[]} newDataset
     */
    _copyDataset: function (dataset) {
      var newDataset = [];
      for (var i = 0, j = dataset.length; i < j; i++) {
        newDataset.push(Object.assign({}, dataset[i]));
      }
      return newDataset;
    },

    /**
     * Return the unique values of the selected field
     * @param {string} field - field's name
     * @returns {string[]} values - list of all the unique values
     */
    _getUniqueFieldValues: function (field) {
      return this.options.data.map(function (row) {
        return row[field];
      }).filter(function (value, index, values) {
        return values.indexOf(value) === index;
      });
    },

    /**
     * Init the _filters array
     */
    _initFilters: function () {
      // eslint-disable-next-line no-underscore-dangle
      this.options._filters = this.options.filteringFields.map(function (filter) {
        return {
          name: filter,
          value: null,
          values: this._getUniqueFieldValues(filter).sort()
        };
      }, this);
    },

    render: function () {
      this.el.innerHTML = this.template({
        // eslint-disable-next-line no-underscore-dangle
        filters: this.options._filters
      });
    }

  });
})(this.App));
