((function (App) {
  'use strict';

  // DO NOT DELETE THIS ROUTER
  // It may be used to instantiate (indirectly through the dispatcher)
  // the quick links component

  App.Router.AdminIndex = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      // We initialize the tabs
      new App.View.TabView({
        el: $('.js-tabs'),
        redirect: true,
        currentTab: 0,
        tabs: [
          { name: 'Sites', url: '/admin/sites/' },
          { name: 'Users', url: '/admin/users/' }
        ]
      });
    }
  });
})(this.App));
