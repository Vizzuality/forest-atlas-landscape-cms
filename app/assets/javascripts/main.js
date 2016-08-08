
(function(App) {

  'use strict';

  App.View.MainView = Backbone.View.extend({

    el: '#main',

    initialize: function() {

      // inits router
      new App.Router();
    }

  });

})(this.App);
