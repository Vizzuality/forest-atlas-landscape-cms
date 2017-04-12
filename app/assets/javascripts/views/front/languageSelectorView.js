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

        this.options.languages = this._getSiteLanguages(languages);

        var currentLanguageCode = Transifex.live.getSelectedLanguageCode();
        this.options.currentLanguage = _.findWhere(this.options.languages, { code: currentLanguageCode });

        // If the user is seeing the standalone map, we need to update its language
        // Nevertheless, it seems the map doesn't have any API so we're doing kind of
        // a trick here
        if (window.route === 'Map') {
          this._setMapLanguage(currentLanguageCode);
        }

        // If the URL doesn't contain the language query parameter, we add it so it
        // can be shareable
        if (!/\?(.*)?l=[a-z]{2}/.test(location.search)) {
          var url = (!location.search.length ? '?' : '&') + 'l=' + currentLanguageCode;
          // NOTE: adding { turbolinks: {} } is mandatory to avoid breaking the browser's back button
          // because Turbolinks doesn't handle well the URL changes
          // Check here: https://github.com/turbolinks/turbolinks/issues/219
          history.replaceState({ turbolinks: {} }, '', url);
        }

        this.render();
      }.bind(this));
    },

    _getSiteLanguages: function(languages) {
      if (!window.gon || !window.gon.translations) {
        return languages;
      }

      const result = languages.filter(function(elem) {
        return window.gon.translations[elem.code];
      });

      return result;
    },

    /**
     * Callback executed when the user selects a language in the
     * dropdown
     * @param {string} languageCode
     */
    _onLanguageChange: function (languageCode) {
      Transifex.live.translateTo(languageCode, true);
      this._setMapLanguage(languageCode);

      // We update the URL with the new language choice
      var search = location.search.replace(/l=[a-z]{2}/, 'l=' + languageCode);
      // NOTE: adding { turbolinks: {} } is mandatory to avoid breaking the browser's back button
      // because Turbolinks doesn't handle well the URL changes
      // Check here: https://github.com/turbolinks/turbolinks/issues/219
      history.replaceState({ turbolinks: {} }, '', search);

      this.trigger('state:change', {
        currentLanguage: _.findWhere(this.options.languages, { code: languageCode })
      });
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

    updateCurrentLanguage: function (lang) {
      this.options.currentLanguage = lang;
      this.dropdownSelectorView.setActive(this._getSelectorActiveOption());
      this.dropdownSelectorView.render();
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
