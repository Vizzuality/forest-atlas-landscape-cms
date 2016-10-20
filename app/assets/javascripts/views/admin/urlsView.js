((function (App) {
  'use strict';

  var Collection = Backbone.Collection.extend({
    // url: 'flag_colors.json'
  });

  App.View.UrlsView = Backbone.View.extend({
    className: 'c-urls',
    template: HandlebarsTemplates['admin/urls'],
    collection: new Collection(
      window.gon ? gon.urlArray : []
    ),
    defaults: {
    },
    events: {
      'click .js-add-url': '_addUrl',
      'click .js-remove-url': '_removeUrl',
      'blur input': '_updateUrl'
    },

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);
      this.render();
    },

    _addUrl: function () {
      this.render();
    },

    /*

     */
    _removeUrl: function (e) {
      if (this._canRemoveUrl()) {
        var index = +e.target.dataset.id,
          model = this.collection.at(index);
        this.collection.remove(model);
        this.render();
      }
    },

    _updateUrl: function (e) {
      var input = e.target;
      var position = +input.dataset.id || this.collection.length;
      var model = this.collection.at(position);

      if (!model) {
        this.collection.push({ url: input.value });
      } else {
        model.set({ url: input.value });
      }
    },

    _canRemoveUrl: function () {
      return (this.collection.length > 0);
    },

    render: function () {
      this.$el.html(this.template({
        urls: this.collection.toJSON(),
        inputId: (window.gon && gon.urlControllerId) ? gon.urlControllerId : '',
        inputName: (window.gon && gon.urlControllerName) ? gon.urlControllerName : ''
      }));
      this.setElement(this.el);
    }
  });
})(this.App));
