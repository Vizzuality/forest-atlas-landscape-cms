/* eslint-disable */
(function (App) {
  'use strict';

  var init = function () {
    if (window.route) {
      new App.View.HeaderView({
        el: document.querySelector('.js-header')
      })

      var translate = false;
      if (gon && gon.translations) {
        translate = Object.keys(gon.translations).some(function (elem) {
          return gon.translations[elem];
        });
      }

      if (translate) {
        // NOTE: because there's two language selectors in the webpage, we need to maintain them in sync
        var desktopLanguageSelector = new App.View.LanguageSelectorView();
        var mobileDesktopLanguageSelector = new App.View.LanguageSelectorView({
          el: '.js-language-selector-mobile',
          useShortName: false
        });

        // Here we listen to changes in one selector and manually update the other one.
        desktopLanguageSelector.listenTo(mobileDesktopLanguageSelector, 'state:change', function (state) {
          this.updateCurrentLanguage(state.currentLanguage);
        });
        mobileDesktopLanguageSelector.listenTo(desktopLanguageSelector, 'state:change', function (state) {
          this.updateCurrentLanguage(state.currentLanguage);
        });
      }

      if (window.route === 'Map') {
        document.querySelector('body').classList.add('-wide');
      }
    }
  };

  // We need for the DOM to be ready
  window.addEventListener('DOMContentLoaded', init);
}).call(this, this.App);
