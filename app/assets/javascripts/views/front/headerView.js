((function (App) {
  'use strict';

  App.View.HeaderView = Backbone.View.extend({

    events: {
      'click .js-mobile-menu': 'toggleDrawer'
    },

    initialize: function () {
      this.MAX_ITEMS = 4;
      this.drawer = this.el.querySelector('.js-mobile-drawer');
      this._renderMenu();
    },

    _renderMenu: function () {
      var menu = this.$el.find('.js-desktop-menu');
      if (menu.children().length > this.MAX_ITEMS) this._renderDropdown(menu);
      menu[0].classList.remove('is-hidden');
    },

    _renderDropdown: function (menu) {
      var dropdown = $('<li class="dropdown-item">More<ul><li><a>More</a></li></ul></li>');
      var dropdownList = dropdown.find('ul');
      var more = Array.prototype.splice.call(menu.find('>li'), this.MAX_ITEMS, menu.children().length);

      more.forEach(function (item) {
        var ul = $(item).find('ul');
        if (ul) {
          dropdownList.append(ul.children());
          item.remove();
        }
        else dropdownList.append(item);
      });
      menu.append(dropdown);
    },

    toggleDrawer: function () {
      this.drawer.classList.toggle('-opened');
    }

  });
})(this.App));
