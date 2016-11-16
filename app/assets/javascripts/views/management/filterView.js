((function (App) {
  'use strict';

  var CollectionFilters = Backbone.Collection.extend({
    url: 'filters.json',
  });

  var CollectionChangeables = Backbone.Collection.extend({
    url: 'filters.json',
  });

  App.View.FilterView = Backbone.View.extend({

    template: HandlebarsTemplates['management/site-switcher'],
    collectionFilters: new CollectionFilters(),
    collectionChangeables: new CollectionChangeables(),

    events: {
      'click .js-add-filter': '_addFilter',
      'click .js-remove-filter': '_removeFilter',
      'change input.js-input-filter': '_updateFilter',
      'change input.js-input-visible': '_updateVisible'

      // TODO: Display different text boxes whenever the type of the first field is a string, number or date
      // 'change input.js-input-filter-type': '_onChange'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, {}, settings);

      this.collectionFilters.fetch()
        .done(this.render.bind(this))
        .fail(function () {
          throw new Error('Unable to load the lists of site for the site switcher selector.');
        });
    },

    _computeUrl: function (slug) {
      return this.options.urlFormat.replace(':slug', slug);
    },

    _addFilter: function () {
      this.collectionFilters.push({ filter: this.options.filter });
      this.collectionFilters.push('false');
      this.render();
    },

    _removeFilter: function (e) {
      var index = $(e.target).data('id');
      var model = this.collectionFilters.at(+index);
      this.collectionFilters.remove(model);

      model = this.collectionChangeables.at(+index);
      this.collectionChangeables.remove(model);
      this.render();
    },

    _updateFilter: function (e) {
      var filter = $(e.target).val();
      var position = $(e.target).data('id');
      var model = this.collectionFilters.at(position);
      // TODO: This is wrong, this should be a query with the data of all fields
      model.set(filter);
    },

    _updateVisible: function (e) {
      var changeable = $(e.target).val();
      var position = $(e.target).data('id');
      var model = this.collectionChangeables.at(position);
      model.set(changeable);
    },

    render: function () {
      this.$el.html(this.template({
        // TODO Clement, please do your magic here
        fields: window.gon && window.gon.fields,
        filters: {}
      }));
      this.setElement(this.el);
    }
  });
})(this.App));
