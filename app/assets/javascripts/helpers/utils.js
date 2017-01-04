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

    /**
     * Return a date object parsed as a UTC time
     * NOTE: the string must not contain a timezone
     * @param {string} str - date parseable by Date.parse
     * @returns {Date}
     */
    parseUTCDate: function (str) {
      return new Date(Date.parse(str + ' UTC'));
    }
  };
})(this.App));
