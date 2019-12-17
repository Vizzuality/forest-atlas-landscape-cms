(function (App) {
  'use strict';

  App.View.ColorSelectorView = Backbone.View.extend({
    events: {
      'change input[type="text"]': '_updateColor',
      'change input[type="color"]': '_updateColor'
    },

    /**
     * Update the color corresponding to the modified input
     * @param {Event} e - DOM input node
     */
    _updateColor: function (e) {
      var color = e.currentTarget.value;
      var textInput = this.el.querySelector('input[type="text"]');
      var colorInput = this.el.querySelector('input[type="color"]');

      textInput.value = color;
      colorInput.value = color;
    }
  });
})(this.App);
