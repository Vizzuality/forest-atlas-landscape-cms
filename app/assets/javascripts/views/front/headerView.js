((function (App) {
  'use strict';

  App.View.HeaderView = Backbone.View.extend({

    events: {
      'click .js-mobile-menu': 'toggleDrawer'
    },

    initialize: function () {
      this.drawer = this.el.querySelector('.js-mobile-drawer');
    },

    toggleDrawer: function () {
      this.drawer.classList.toggle('-opened');
    }

  });
})(this.App));
