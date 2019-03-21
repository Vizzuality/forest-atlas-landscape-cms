(function(App) {
  "use strict";

  App.Router.FrontTagSearching = Backbone.Router.extend({
    routes: {
      "(/)": "index"
    },

    initialize: function() {
      // Instantiate the common views here for the page, use the "routes" object to instantiate
      // per route views
      new App.View.HeaderView({
        el: document.querySelector(".js-header")
      });
    },

    index: function() {}
  });
})(this.App);
