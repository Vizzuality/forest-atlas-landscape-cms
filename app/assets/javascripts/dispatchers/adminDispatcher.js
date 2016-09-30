(function (App) {
  'use strict';

  var Dispatcher = Backbone.Router.extend({
    routes: {
        '(/)': 'Index',
        'sites/site_settings/:id(/)': 'Settings'
    }
  });

  var init = function () {
    var dispatcher = new Dispatcher();

    dispatcher.on('route', function (routeName, params) {
      Backbone.history.stop();
      var Router = App.Router['Admin' + routeName];

      if (Router) {
        new Router(params.slice(0, params.length - 1));

        Backbone.history.start({ pushState: false });
      }
    });

    // Because turbolinks doesn't fully reload the page, we need to stop the
    // history before anything else
    Backbone.history.stop();

    // We need this to detect router pathname
    Backbone.history.start({ pushState: true, root: '/admin' });
  };

  // We need for the DOM to be ready
  document.addEventListener('turbolinks:load', init);
}).call(this, this.App);
