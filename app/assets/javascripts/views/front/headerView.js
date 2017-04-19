((function (App) {
  'use strict';

  App.View.HeaderView = Backbone.View.extend({

    events: {
      'click .js-mobile-menu': 'toggleDrawer'
    },

    initialize: function () {
      this.drawer = this.el.querySelector('.js-mobile-drawer');
      this._onResize();
      this._setListeners();
    },

    _onResize: function () {
      this.el.classList.remove('-overflow');
      if (this._menuOverflows()) {
        this.el.classList.add('-overflow');
      }
    },

    _menuOverflows: function () {
      var menu = this.el.querySelector('.js-desktop-menu');
      var childrenWidth = Array.prototype.reduce.call(menu.firstElementChild.children, function (acc, child) {
        var childWidth = child.getBoundingClientRect().width;
        if (typeof acc !== 'number') return acc.getBoundingClientRect().width + childWidth;
        return acc + childWidth;
      });
      var parentWidth = menu.firstElementChild.getBoundingClientRect().width;

      return (parentWidth < (childrenWidth + 20));
    },

    _setListeners: function () {
      window.addEventListener('resize', _.debounce(this._onResize.bind(this), 150));
    },

    toggleDrawer: function () {
      this.drawer.classList.toggle('-opened');
    }

  });
})(this.App));
