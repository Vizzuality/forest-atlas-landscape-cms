((function (App) {
  'use strict';

  App.Helper.ColorSelector = {
    /**
     * Initialize the specified color selector
     * @param {string} colorContainer - color which container the color selector
     */
    initialize: function (colorContainer) {
      var themeColorContainer = document.querySelector(colorContainer);
      var input = themeColorContainer.querySelector('input');
      var colorLabel = themeColorContainer.querySelector('.js-label');
      var preview = themeColorContainer.querySelector('.js-preview');

      // We initialize the preview with the saved color
      preview.style.backgroundColor = input.value;

      input.addEventListener('change', function () {
        preview.style.backgroundColor = input.value;
      });

      colorLabel.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          this.click();
        }
      });
    }
  };
})(this.App));
