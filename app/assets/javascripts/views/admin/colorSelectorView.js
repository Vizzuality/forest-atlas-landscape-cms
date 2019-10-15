(function (App) {
  'use strict';

  App.View.ColorSelectorView = Backbone.View.extend({
    className: 'js-theme-color',
    template: HandlebarsTemplates['admin/color-selector'],

    defaults: {
      title: 'Theme color',
      label: 'Change theme color',
      inputId: 'color',
      inputName: 'color',
      colorName: 'color',
      color: '#000000'
    },

    events: {
      'keydown .js-label': '_clickInput',
      'change input': '_updateColor'
    },

    initialize: function (settings) {
      var vm = this;

      this.options = Object.assign({}, this.defaults, settings);
      [
        'title',
        'color',
        'inputId',
        'inputName',
        'colorName'
      ].forEach(function(option) {
        vm[option] = vm.options[option];
      });

      this.render();
    },

    _clickInput: function(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.click();
      }
    },

    /**
     * Update the color corresponding to the modified input
     * @param {Event} e - DOM input node
     */
    _updateColor: function (e) {
      var input = e.currentTarget;
      this.color = input.value;

      // We can't just render here because otherwise, when the user is choosing a
      // color in the color picker, Chrome will send the event while the user is
      // still picking one. On FF, the event is sent only when the user closes the
      // picker.
      input.nextElementSibling.style.backgroundColor = color;

      // We then manually update the hidden field
      this.hiddenColorsInput.value = this.color;
    },

    render: function () {
      if (!this.el) return;

      this.$el.html(this.template({
        title: this.title,
        label: this.label,
        color: this.color,
        inputId: this.inputId,
        inputName: this.inputName,
        colorName: this.colorName,
        colorValue: this.color
      }));
      this.setElement(this.el);

      this.hiddenColorsInput = this.el.querySelector('.js-color-input');
    }
  });
})(this.App);
