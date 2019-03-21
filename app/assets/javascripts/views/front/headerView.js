((function (App) {
  'use strict';

  App.View.HeaderView = Backbone.View.extend({

    events: {
      'click .js-mobile-menu': 'toggleDrawer',
      'click .js-search-button': 'onClickSearchButton',
    },

    initialize: function () {
      this.drawer = this.el.querySelector('.js-mobile-drawer');
      this.searchContainer = this.el.querySelector('.js-search');
      this.el.classList.add('initialized');
      this._setListeners();
    },

    /**
     * Set the listeners not attached to any DOM element of this.el
     */
    _setListeners: function () {
      document.body.addEventListener('click', function (e) {
        if ($(e.target).closest(this.searchContainer).length) return;
        this.toggleSearch(false);
      }.bind(this));
    },

    onClickSearchButton: function () {
      this.toggleSearch();
    },

    toggleDrawer: function () {
      var opened = this.drawer.classList.toggle('-opened');
      var overflow = 'auto';
      if (opened) overflow = 'hidden';
      document.querySelector('body').style.overflow = overflow;
    },

    /**
     * Toggle the visibility of the search container
     * @param {boolean} [show] Force the search to expand or contract
     */
    toggleSearch: function(show) {
      this.searchContainer.classList.toggle('-expanded', show);
    }

  });
})(this.App));
