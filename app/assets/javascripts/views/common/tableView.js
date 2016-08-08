(function(App) {

  'use strict';


  App.View.TableView = Backbone.View.extend({

    defaults: {
      resultsPerPage: 3
    },

    el: '#table',

    events: {
      'click .pagination-link': '_updatePagination',
      'change #filter-sort' : '_onSortResults',
      'keyup #filter-search' : '_onFilterResults'
    },

    initialize: function(settings) {
      this.options = {
        headers: settings.headers,
        resultsPerPage: settings.resultsPerPage || this.defaults.resultsPerPage,
        tab: settings.tab,
        isSortable: settings.filters.sortBy ? settings.filters.sortBy : false,
        hasSearch: settings.filters.search ? settings.filters.search : false
      };

      this.paginationIndex = 0;

      this.template = HandlebarsTemplates['common/table'];

      this._initCollection();
      this._setListeners();
      this._setVars();

      this._renderFilters();

      this.collection.fetch();
    },

    _initCollection: function() {
      var tab = this.options.tab,
        collectionOptions = {
          headers : this.options.headers,
          resultsPerPage: this.options.resultsPerPage
        };

      if(tab == 'sites') {
        this.collection = new App.Collection.Site({}, collectionOptions);
      }

      if(tab == 'users') {
        this.collection = new App.Collection.User({}, collectionOptions);
      }
    },

    _setVars: function() {
      // DOM
      this.$filterContainer = this.$el.find('#js--filter');
      this.$tableContainer = this.$el.find('#js--table');
    },

    _renderFilters: function() {
      var template = HandlebarsTemplates['common/table_filters'],
        filters = this.options.headers,
        filtersOptions = {
          hasSearch: this.options.hasSearch,
          isSortable: this.options.isSortable
        };

      this.$filterContainer.html(template({
        hasSearch: filtersOptions.hasSearch,
        isSortable: filtersOptions.isSortable,
        filters: filters
      }));
    },

    _setListeners: function() {
      this.collection.on('sync', function() {
        this.collection._initSearch();
        this.render();
      }.bind(this));
    },

    _updatePagination: function(e) {
      if(!e)  return;

      e.preventDefault();

      var page = $(e.currentTarget).data('page');

      if (page == this.paginationIndex) return;

      this.paginationIndex = page;

      this.render();
    },

    _setPagination: function() {
      var totalData = this.collection.length,
        resultsPerPage  = this.options.resultsPerPage,
        pagination = totalData / resultsPerPage;

      if (pagination == 1 || pagination < 1) return;

      if (pagination > Math.trunc(pagination)) {
        pagination++;
      }

      var paginationList = document.createElement('ul');
      paginationList.setAttribute('class', 'pagination-list');

      for (var i = 1; i <= pagination; i++) {
        var pag = document.createElement('li'),
          linkPag = document.createElement('a');

        pag.setAttribute('class', 'pagination-item');

        linkPag.setAttribute('href', '#');
        linkPag.setAttribute('data-page', i - 1);
        linkPag.setAttribute('class', 'pagination-link');
        linkPag.innerText = i;

        pag.appendChild(linkPag);
        paginationList.appendChild(pag);
      }

      this.$tableContainer.find('#pagination').html(paginationList);
    },

    _onSortResults: function(e) {
      if (!e) return;

      var key = e.currentTarget.value;

      if (!key) return;

      this.collection.sortResults(key);

      // reset pagination
      this.paginationIndex = 0;

      this.render();
    },

    _onFilterResults: function(e) {
      if(!e) return;

      var keyword = e.currentTarget.value;

      this.collection.search(keyword);

      // reset pagination
      this.paginationIndex = 0;

      this.render();
    },

    render: function() {
      var paginatedResults = this.collection.paginate(this.paginationIndex),
        parsedResults = this.collection.parseResults(paginatedResults);

      this.$tableContainer.html(this.template({
        headers: this.options.headers,
        results: parsedResults
      }));

      this._setPagination();
    }

  });

})(this.App);
