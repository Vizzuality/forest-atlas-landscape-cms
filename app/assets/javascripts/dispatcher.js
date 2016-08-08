(function(App) {

  'use strict';

  function _initApp() {
    var app = new App.MainView();

    if (Backbone.history.started) {
      app.stop();
    }

    app.start();
  };

  document.addEventListener('DOMContentLoaded', _initApp);

})(this.App);
