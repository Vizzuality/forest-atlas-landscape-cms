(function (App) {
  'use strict';
  App.View.FlagColorsView = Backbone.View.extend({
    className: 'c-flag-colors',
    template: HandlebarsTemplates['admin/flag-colors'],

    defaults: {
      defaultColor: '#000000',
      colors: [],
      maxColors: 5,
      inputId: window.gon && gon.global && gon.global.color_controller_id,
      inputName: window.gon && gon.global && gon.global.color_controller_name
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

    /**
     * Add a new element to the collection with the default color
     */
    _addColor: function () {
      if (this._canAddColor()) {
        this.options.colors.push(this.options.defaultColor);
        this.render();
      }
    },

    /**
     * Remove the color designated by the DOM node
     * @param {object} e - DOM node designating the color to remove
     */
    _removeColor: function (e) {
      var index = +$(e.target).data('id');
      this.options.colors.splice(index, 1);
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
      
      this.options.colors.splice(position, 1, color);
      this.render();
    },

    /**
     * Serialize the colors for the hidden input
     * @returns {string}
     */
    _serializeColors: function () {
      return this.options.colors.join(' ');
    },

    /**
     * Return whether the user can add a new color
     * @returns {boolean} true if can add a color
     */
    _canAddColor: function () {
      return (this.options.colors.length < this.options.maxColors);
    },

    render: function () {
      if (!this.el) return;

      this.$el.html(this.template({
        colors: this.options.colors,
        addButtonVisible: this._canAddColor(),
        inputId: this.options.inputId,
        inputName: this.options.inputName,
        colorsName: this.options.name,
        colorsValue: this._serializeColors(),
        colorsPosition: this.options.position
      }));
      this.setElement(this.el);

      this.hiddenColorsInput = this.el.querySelector('.js-colors-input');
    }
  });
})(this.App);
