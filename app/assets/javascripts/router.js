
(function(App) {

  App.Router = Backbone.Router.extend({

    routes: {
      '' : '_home',
      '/widgets' : '_widgets',
      '/map': '_map'
    },

    _home: function() {
      console.log('home');
    },

    _widgets: function() {
      console.log('widgets');
    },

    _map: function() {
      console.log('map');
    }

  });

})(this.App);
