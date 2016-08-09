
(function(App) {

  'use strict';

  App.Router.Homepage = Backbone.Router.extend({

    routes: {
      '(/)': 'homepage'
    },

    homepage: function() {
      console.info('You are at homepage');

      new App.View.HomeView();
    }

  });

})(this.App);
