(function (App) {
  'use strict';

  var Collection = Backbone.Collection.extend({
    url: 'flag_colors.json'
  });

  App.View.FlagColorsView = Backbone.View.extend({
    className: 'c-flag-colors',
    template: HandlebarsTemplates['admin/flag-colors'],

    defaults: {
      color: '#000000',
      maxColors: 5
    },

    events: {
      'click .js-add-color': '_addColor',
      'click .js-remove-color': '_removeColor',
      'change input': '_updateColor'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.collection = new Collection((window.gon && gon.global.colorArray && gon.global.colorArray) || []);
      this.render();
    },

    /**
     * Add a new element to the collection with the default color
     */
    _addColor: function () {
      if (this._canAddColor()) {
        this.collection.push({ color: this.options.color });
        this.render();
      }
    },

    /**
     * Remove the color designated by the DOM node
     * @param {object} e - DOM node designating the color to remove
     */
    _removeColor: function (e) {
      var index = $(e.target).data('id');
      var model = this.collection.at(+index);
      this.collection.remove(model);
      this.render();
    },

    /**
     * Update the color corresponding to the modified input
     * @param {Event} e - DOM input node
     */
    _updateColor: function (e) {
      var input = e.currentTarget;
      var color = input.value;
      var position = input.dataset.id;
      var model = this.collection.at(position);

      model.set({ color: color });

      // We can't just render here because otherwise, when the user is choosing a
      // color in the color picker, Chrome will send the event while the user is
      // still picking one. On FF, the event is sent only when the user closes the
      // picker.
      input.nextElementSibling.style.backgroundColor = color;

      // We then manually update the hidden field
      this.hiddenColorsInput.value = this._serializeColors();
    },

    /**
     * Serialize the colors for the hidden input
     * @returns {string}
     */
    _serializeColors: function () {
      return this.collection.toJSON().reduce(function (eachRes, color) {
        return eachRes + ' ' + color.color;
      }, '');
    },

    /**
     * Return whether the user can add a new color
     * @returns {boolean} true if can add a color
     */
    _canAddColor: function () {
      return (this.collection.length < this.options.maxColors);
    },

    render: function () {
      this.$el.html(this.template({
        colors: this.collection.toJSON()
          .map(function (color, i) {
            color.index = i + 1; // Index used by the label
            return color;
          }, this),
        addButtonVisible: this._canAddColor(),
        inputId: window.gon && gon.global && gon.global.colorControllerId,
        inputName: window.gon && gon.global && gon.global.colorControllerName,
        colorsValue: this._serializeColors()
      }));
      this.setElement(this.el);

      this.hiddenColorsInput = this.el.querySelector('.js-colors-input');
    }
  });
})(this.App);
