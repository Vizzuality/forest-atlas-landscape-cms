
(function(App) {

  'use strict';

  App.Router.Admin = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function() {
      console.info('You are at admin page');

      document.addEventListener('DOMContentLoaded', function() {
        new App.View.AdminView();
      });
    }

  });

})(this.App);
