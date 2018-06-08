/* eslint-disable */
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
      currentLanguage: null,
      // Display the short name or not
      useShortName: true
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      // This prevents the website to stop working if Transifex
      // doesn't load
      if (!Transifex) return;

      Transifex.live.onFetchLanguages(function (languages) {
        this.options.transifexLanguages = languages;
        this.options.languages = this._getSiteLanguages(languages);
        this.options.currentLanguage = Transifex.live.getSelectedLanguageCode();
        this.render();
      }.bind(this));
    },

    _getSiteLanguages: function(languages) {
      if (!window.gon || !window.gon.translations) {
        return languages;
      }

      return languages.map(function(lang) {
        return lang.code;
      });
    },

    /**
     * Callback executed when the user selects a language in the
     * dropdown
     * @param {string} languageCode
     */
    _onLanguageChange: function (languageCode) {
      Transifex.live.translateTo(languageCode, true);
      this._setMapLanguage(languageCode);
      this.trigger('state:change', {
        currentLanguage: _.findWhere(this.options.languages, { code: languageCode })
      });
    },

    /**
     * Return the list of options available for the selector
     * @return {object[]}
     */
    _getSelectorOptions: function () {
      return this.options.transifexLanguages.map(function (language) {
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
      var self = this;
      var selected = this.options.transifexLanguages.filter(function(lang) {
        return lang.code === self.options.currentLanguage;
      })
      if (selected && selected.length) {
        return {
          id: selected[0].code,
          name: selected[0].name,
          shortName: selected[0].code.toUpperCase()
        };
      }
      return null;
    },

    /**
     * Set the language of the standalone map
     * @param {string} languageCode
     */
    _setMapLanguage: function (languageCode) {
      var languagePicker = document.querySelector('.app-header__language[data-lang="' + languageCode + '"]');
      if (languagePicker) languagePicker.click();
    },

    updateCurrentLanguage: function (lang) {
      this.options.currentLanguage = lang;
      this.dropdownSelectorView.setActive(this._getSelectorActiveOption());
      this.dropdownSelectorView.render();
    },

    render: function () {
        this.dropdownSelectorView = new App.View.DropdownSelectorView({
          el: this.el,
          options: this._getSelectorOptions(),
          activeOption: this._getSelectorActiveOption(),
          useShortName: this.options.useShortName,
          align: 'right',
          onChangeCallback: this._onLanguageChange.bind(this)
        });
    }

  });
})(this.App));
