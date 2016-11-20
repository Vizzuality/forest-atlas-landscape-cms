((function (App) {
  'use strict';

  App.View.DashboardFiltersView = Backbone.View.extend({

    template: HandlebarsTemplates['management/dashboard-filters'],
    collection: new Backbone.Collection(),

    defaults: {
      // State of the default filters
      defaultFilter: {
        name: null,
        from: null,
        to: null,
        variable: false
      }
    },

    events: {
      'click .js-add-filter': '_addFilter',
      'click .js-remove-filter': '_removeFilter',
      'blur .js-input-filter': '_updateFilter',
      'change .js-input-variable': '_updateVariable',
      'change .js-input-field': '_onChangeField'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.fields = (window.gon && gon.fields) || [];
      this._addFilter(); // Add a default filter and render
    },

    _addFilter: function () {
      this.collection.push(this.options.defaultFilter);
      this.render();
    },

    _removeFilter: function (e) {
      var index = $(e.target).data('id');
      var model = this.collection.at(+index);
      this.collection.remove(model);
      this.render();
    },

    _updateFilter: function (e) {
      // TODO: Clement, check if there's a better way to do this
      // var filter = e.target.id.match(/.*-/)[0].replace('-','');
      var filter = e.target.getAttribute('data-name');
      var value = e.target.value;
      var position = +e.target.dataset.id;
      var model = this.collection.at(position);

      var o = {};
      o[filter] = value;
      model.set(o);
    },

    _onChangeField: function (e) {
      var value = e.target.value;
      var position = +e.target.dataset.id;
      var model = this.collection.at(position);
      model.set({ name: value });
    },

    _updateVariable: function (e) {
      var value = e.target.checked;
      var position = +e.target.dataset.id;
      var model = this.collection.at(position);
      model.set({ variable: value });
    },

    render: function () {
      this.$el.html(this.template({
        fields: this.fields,
        filters: this.collection.toJSON().map(function (filter, index) {
          return Object.assign({}, filter, { id: index + 1 });
        }),
        json: JSON.stringify(this.collection.toJSON().filter(function (filter) {
          return filter.name;
        }))
      }));
      this.setElement(this.el);
    }
  });
})(this.App));
