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
      var opened = this.drawer.classList.toggle('-opened');
      var overflow = 'auto';
      if (opened) overflow = 'hidden';
      document.querySelector('body').style.overflow = overflow;
    }

  });
})(this.App));
