((function (App) {
  'use strict';

  App.Router.AdminSites = Backbone.Router.extend({

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
