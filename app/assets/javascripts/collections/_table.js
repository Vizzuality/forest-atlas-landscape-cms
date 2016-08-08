
(function(App) {

  'use strict';

  App.Collection.Table = Backbone.Collection.extend({

    defaults: {
      options: {
        search: {
          caseSensitive: false,
          shouldSort: true,
          tokenize: false,
          threshold: 0.6,
          location: 7,
          distance: 100,
          maxPatternLength: 32
        }
      }
    },

    initialize: function(models, settings) {
      this.options = {
        headers: settings.headers || {},
        resultsPerPage: settings.resultsPerPage
      };
    },

    _initSearch: function() {
      var searchOptions = _.extend(this.defaults.options.search,
        {keys: this._getSearchableHeaders() }),
        list = this.toJSON();

      this.fuse = new Fuse(list, searchOptions);

      // this backup is to allow recover the collection in case
      // the search returns 0 results
      this.backupCollection = this.clone();
    },

    _getSearchableHeaders: function() {
      var headers = this.options.headers;

      return _.pluck(_.filter(headers, {searchable: true}), 'field_name');
    },

    paginate: function(page) {
      var resultsPerPage = this.options.resultsPerPage,
        start = resultsPerPage,
        end = resultsPerPage;

      start *= page;
      end = start + resultsPerPage;

      return this.toJSON().slice(start, end);
    },

    sortResults: function(comparator) {
      var sortedResults = this.sortBy(function(model) {
        return model.get(comparator);
      });

      this.set(sortedResults);
    },

    search: function(keyword) {
      var results = this.fuse.search(keyword);

      if (results.length == 0 && keyword.length == 0) {
        this.set(this.backupCollection.toJSON());
        return;
      }

      this.set(results);
    },

    parseResults: function(results) {
      var parsedResult = [],
        headers = this.options.headers;

      _.each(results, function(res) {
        var row = [];

        _.each(headers, function(header) {
          var field = header['field_name'],
            value = res[field];

          row.push({
            field: field,
            value: value
          });
        });

        parsedResult.push(row);

      }.bind(this));

      return parsedResult;
    },

  });

})(this.App);
