((function (App) {
  'use strict';

  App.View.LanguageSelectorView = Backbone.View.extend({

    el: '.js-language-selector',

    defaults: {
      // List of available languages
      // Each language should have this structure:
      // { name: 'French', code: 'fr' }
      languages: [],
      // Current language (use the structure above)
      currentLanguage: null
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      // This prevents the website to stop working if Transifex
      // doesn't load
      if (!Transifex) return;

      Transifex.live.onFetchLanguages(function (languages) {
        this.options.languages = languages;

        var currentLanguageCode = Transifex.live.getSelectedLanguageCode();
        this.options.currentLanguage = _.findWhere(this.options.languages, { code: currentLanguageCode });

        // If the user is seeing the standalone map, we need to update its language
        // Nevertheless, it seems the map doesn't have any API so we're doing kind of
        // a trick here
        if (window.route === 'Map') {
          setTimeout(function () {
            this._setMapLanguage(currentLanguageCode);
          }.bind(this), 1000);
        }

        this.render();
      }.bind(this));
    },

    /**
     * Callback executed when the user selects a language in the
     * dropdown
     * @param {string} languageCode
     */
    _onLanguageChange: function (languageCode) {
      Transifex.live.translateTo(languageCode, true);
      this._setMapLanguage(languageCode);
    },

    /**
     * Return the list of options available for the selector
     * @return {object[]}
     */
    _getSelectorOptions: function () {
      return this.options.languages.map(function (language) {
        return {
          id: language.code,
          name: language.name,
          shortName: language.code.toUpperCase()
        };
      });
    },

    /**
     * Return the active option for the selector
     */
    _getSelectorActiveOption: function () {
      return {
        id: this.options.currentLanguage.code,
        name: this.options.currentLanguage.name,
        shortName: this.options.currentLanguage.code.toUpperCase()
      };
    },

    /**
     * Set the language of the standalone map
     * @param {string} languageCode
     */
    _setMapLanguage: function (languageCode) {
      var languagePicker = document.querySelector('.app-header__language[data-lang="' + languageCode + '"]');
      if (languagePicker) languagePicker.click();
    },

    render: function () {
      if (!this.dropdownSelectorView) {
        this.dropdownSelectorView = new App.View.DropdownSelectorView({
          el: this.el,
          options: this._getSelectorOptions(),
          activeOption: this._getSelectorActiveOption(),
          useShortName: true,
          align: 'right',
          onChangeCallback: this._onLanguageChange.bind(this)
        });
      }
    }

  });
})(this.App));
