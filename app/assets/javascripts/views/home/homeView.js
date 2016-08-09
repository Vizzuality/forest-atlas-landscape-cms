
(function(App) {

  'use strict';

  App.View.HomeView = Backbone.View.extend({

    initialize: function() {
      console.info('homeview initialized');
    }

  });

  new App.View.HomeView();

})(this.App);
