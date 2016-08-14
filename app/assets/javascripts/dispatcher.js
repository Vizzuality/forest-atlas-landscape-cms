(function(App) {

  'use strict';

  var Dispatcher = Backbone.Router.extend({

    routes: {
      '(/)': 'Homepage',
      'admin(/)': 'Admin',
      'management(/)': 'Management'
    }
  });

  var dispatcher = new Dispatcher();

  dispatcher.on('route', function(routeName) {
    Backbone.history.stop();
    var Router = App.Router[routeName];

    if (Router) {
      new Router();

      Backbone.history.start({pushState: false});
    }
  });

  // We need this to detect router pathname
  Backbone.history.start({ pushState: true });

}).call(this, this.App);
