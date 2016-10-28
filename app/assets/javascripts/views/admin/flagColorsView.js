((function (App) {
  'use strict';

  var Collection = Backbone.Collection.extend({
    url: 'flag_colors.json'
  });

  App.View.FlagColorsView = Backbone.View.extend({
    className: 'c-flag-colors',
    template: HandlebarsTemplates['admin/flag-colors'],
    collection: new Collection(window.gon ? gon.colorArray : []),

    defaults: {
      color: '#000000',
      maxColors: 4
    },

    events: {
      'click .js-add-color': '_addColor',
      'click .js-remove-color': '_removeColor',
      'change input': '_updateColor'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render();
    },

    _addColor: function () {
      // If the user wants to add a black color, we need to detect it
      var colorInputs = this.el.querySelectorAll('input[type="color"]');
      if (this._canAddColor() && this.collection.length !== colorInputs.length) {
        var colorArray = Array.prototype.slice.call(colorInputs);
        this.collection.push({ color: colorArray[colorArray.length - 1].value });
      }

      this.render();
    },

    _removeColor: function (e) {
      var index = $(e.target).data('id');
      var model = this.collection.at(+index);
      this.collection.remove(model);
      this.render();
    },

    _updateColor: function (e) {
      console.log('changed');
      var color = $(e.target).val();
      var position = $(e.target).data('id');
      var model = this.collection.at(position);

      if (!model) {
        this.collection.push({ color: color });
      } else {
        model.set({ color: color });
      }
    },

    _canAddColor: function () {
      return (this.collection.length < this.options.maxColors);
    },

    _isAddButtonVisible: function () {
      return (this.collection.length < this.options.maxColors - 1);
    },

    render: function () {
      this.$el.html(this.template({
        colors: this.collection.toJSON()
          .map(function (color, i) {
            color.index = i + 1; // Index used by the label
            return color;
          }),
        lastColorIndex: this.collection.toJSON().length + 1, // Index used by the label of the input outside the loop
        addable: this._canAddColor(),
        addButtonVisible: this._isAddButtonVisible(),
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
