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
        this.options.languages = this._getSiteLanguages(languages);

        var selectedLanguage = Transifex.live.getSelectedLanguageCode();
        var existSelectedLanguage = this.options.languages.some(function(language) {
          return language.code === selectedLanguage;
        });
        if (!existSelectedLanguage) {
          // This case might happen if Transifex is configured so the source language is Zulu
          // but this language is not actually shown as an option as it is just used to translate
          // all the strings of the site into anything else

          if (window.gon && window.gon.default_site_language) {
            var existDefaultLanguage = this.options.languages.some(function(language) {
              return language.code === window.gon.default_site_language;
            });
            if (existDefaultLanguage) {
              this.options.currentLanguage = window.gon.default_site_language;
            } else if (this.options.languages.length) {
              this.options.currentLanguage = this.options.languages[0].code;
            }
          } else if (this.options.languages.length) {
            this.options.currentLanguage = this.options.languages[0].code;
          }

          if (!this.options.currentLanguage) {
            console.warn('Unable to set the default language due to a wrong configuration');
          } else {
            Transifex.live.translateTo(this.options.currentLanguage, true);
          }
        } else {
          this.options.currentLanguage = selectedLanguage;
        }

        if (window.route === 'Map') {
          // Dont block the stack,
          // put it in the event que so we can render the language selector before translating the map
          var self = this;
          setTimeout(function () {
            self._setMapLanguage(self.options.currentLanguage);
          }, 0)
        }

        // We update the url
        if (!/\?(.*)?l=[a-z]{2}/.test(location.search)) {
          var url = (!location.search.length ? '?' : (location.search + '&')) + 'l=' + this.options.currentLanguage;
          history.replaceState(null, '', url);
        }

        this.render();
      }.bind(this));
    },

    _getSiteLanguages: function(languages) {
      if (!window.gon || !window.gon.translations) {
        return languages;
      }

      return languages.filter(function(language) {
        return window.gon.translations[language.code];
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
        currentLanguage: _.find(this.options.languages, { code: languageCode })
      });

      // We update the URL with the new choice
      var search = location.search.replace(/l=[a-z]{2}/, 'l=' + languageCode);
      history.replaceState(null, '', search);

      // We also update the localStorage
      localStorage.setItem('language', languageCode);
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
      var self = this;
      var selected = this.options.languages.filter(function(lang) {
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
      if (languagePicker) {
        languagePicker.click()
      } else {
        console.log('Language not found for map builder', languageCode)
      }
    },

    // This method is called from the outside (see frontDispatcher)
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
