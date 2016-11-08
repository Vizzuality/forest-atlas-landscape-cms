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
      this.collection = new Collection((window.gon && gon.global.colorArray && gon.global.colorArray)
        || [this.options.color]);
      this.render();
    },

    /**
     * Add a new element to the collection with the default color
     */
    _addColor: function () {
      if (this._canAddColor()) {
        this.collection.push({color: this.options.color});
        this.render();
      }
    },

    /**
     * Remove the color designated by the DOM node
     * @param {object} e - DOM node designating the color to remove
     */
    _removeColor: function (e) {
      if (this._canRemoveColor()) {
        var index = $(e.target).data('id');
        var model = this.collection.at(+index);
        this.collection.remove(model);
        this.render();
      }
    },

    /**
     * Update the color corresponding to the modified input
     * @param {object} e - DOM input node
     */
    _updateColor: function (e) {
      var color = $(e.target).val();
      var position = $(e.target).data('id');
      var model = this.collection.at(position);
      model.set({color: color});
    },

    /**
     * Return whether the user can add a new color
     * @returns {boolean} true if can add a color
     */
    _canAddColor: function () {
      return (this.collection.length < this.options.maxColors);
    },

    /**
     * Return whether the user can remove a color
     * @returns {boolean} true if can remove a color
     */
    _canRemoveColor: function () {
      return this.collection.length > 1;
    },

    render: function () {
      this.$el.html(this.template({
        colors: this.collection.toJSON()
          .map(function (color, i) {
            color.index = i + 1; // Index used by the label
            color.canRemoveColor = this._canRemoveColor();
            return color;
          }, this),
        addButtonVisible: this._canAddColor(),
        inputId: window.gon && gon.global && gon.global.colorControllerId,
        inputName: window.gon && gon.global && gon.global.colorControllerName,
        colorsValue: this.collection.toJSON().reduce(function (eachRes, color) {
          return eachRes + ' ' + color.color;
        }, '')
      }));
      this.setElement(this.el);
    }
  });
})(this.App);
