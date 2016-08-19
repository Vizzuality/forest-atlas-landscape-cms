((function (App) {
  'use strict';

  App.View.HomeView = Backbone.View.extend({

    initialize: function () {
      // Uncomment this code block to test tabs
      // var tabView = new App.View.TabView({
      //   tabs: ['tab1', 'tab2', 'tab3']
      // }).render();
      //
      // $('body').html(tabView);
    }

  });

  new App.View.HomeView();
})(this.App));
