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

      new App.Router[routerName]();

      // NOTE: Don't forget to start Backbone.history in the router

    } else {
      // eslint-disable-next-line no-console
      console.warn('The route ' + window.route + ' doesn\'t have any associated router.');
    }
  };

  // We need for the DOM to be ready
  document.addEventListener('turbolinks:load', init);
}).call(this, this.App);
