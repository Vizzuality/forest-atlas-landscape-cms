(function (App) {
  'use strict';

  var init = function () {
    // We can't use a Backbone router here because the domain and path of the sites are
    // chosen by a manager. In order to know which JS router/view to instantiate, we read
    // a global variable called "route" created inside the rails view matching each template

    var routerName = 'Front' + window.route;

    if (App.Router[routerName]) {
      // Because turbolinks doesn't fully reload the page, we need to stop the
      // history before anything else
      Backbone.history.stop();

      // Backbone.history.stop has some asynchronous events that can trigger twice
      // the same route when Backbone.history.start is executed
      setTimeout(function () {
        new App.Router[routerName]();
      }, 0);

      // NOTE: Don't forget to start Backbone.history in the router

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
    } else {
      // eslint-disable-next-line no-console
      console.warn('The route ' + window.route + ' doesn\'t have any associated router.');
    }
  };

  // We need for the DOM to be ready
  document.addEventListener('turbolinks:load', init);
}).call(this, this.App);
