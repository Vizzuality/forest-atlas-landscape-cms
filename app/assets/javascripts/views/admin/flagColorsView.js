((function (App) {
  'use strict';

  var Collection = Backbone.Collection.extend({
    url: 'flag_colors.json'
  });

  App.View.FlagColorsView = Backbone.View.extend({
    className: 'c-flag-colors',
    template: HandlebarsTemplates['admin/flag-colors'],
    collection: new Collection(
      window.gon ? gon.colorArray: []
    ),
    defaults: {
      color: '#000000'
    },
    events: {
      'click .js-add-color': '_addColor',
      'click .js-remove-color': '_removeColor',
      'input input': '_updateColor'
    },

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);
      this.render();
    },

    _addColor: function () {
      if (this._canAddColor()) {
        this.collection.push({ color: this.options.color });
        this.render();
      }
    },

    /*

     */
    _removeColor: function (e) {
      var index = $(e.target).data('id'),
        model = this.collection.at(+index);
      this.collection.remove(model);
      this.render();
    },

    _updateColor: function (e) {
      var color = $(e.target).val(),
        position = $(e.target).data('id');

      this.collection.at(position).set({ color: color });
      this.render();
    },

    _canAddColor: function () {
      return (this.collection.length <= 4);
    },

    render: function () {
      this.$el.html(this.template({
        colors: this.collection.toJSON(),
        addable: this._canAddColor(),
        inputId: window.gon && gon.colorControllerId,
        inputName: window.gon && gon.colorControllerName,
        colorsValue: this.collection.toJSON().reduce(function (eachRes, color) {
          return eachRes + ' ' + color.color;
        }, '')
      }));
      this.setElement(this.el);
    }
  });
})(this.App));
