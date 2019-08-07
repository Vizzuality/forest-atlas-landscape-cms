((function (App) {
  'use strict';

  App.Helper.Utils = {
    /**
     * Return the string with title case
     * @param {string} str - original string
     * @returns {string} string with title case
     */
    toTitleCase: function (str) {
      if (!str || !str.length) return '';
      return str[0].toUpperCase() + str.slice(1, str.length);
    },
  };
})(this.App));
