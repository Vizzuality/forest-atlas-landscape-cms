((function (App) {
  'use strict';

  App.Router.AdminUsers = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      // We initialize the tabs
      new App.View.TabView({
        el: $('.js-tabs'),
        redirect: true,
        currentTab: 1,
        tabs: [
          { name: 'Sites', url: '/admin/sites/' },
          { name: 'Users', url: '/admin/users/' }
        ]
      });
    }
  });
})(this.App));
