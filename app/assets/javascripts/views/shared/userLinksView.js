((function (App) {
  'use strict';

  App.View.UserLinksView = Backbone.View.extend({

    defaults: {
      // List of links
      // NOTE: follow the syntax of the options of the dropdown component but
      // add an attribute with the actual URL
      // NOTE: if you plan to change the default links, please take care
      // at their modification in the initialize method
      links: [
        { id: 'user', name: 'User', url: null },
        { id: 'edit', name: 'Edit profile', url: null },
        { id: 'logout', name: 'Log out', url: null }
      ],
      // id of the active link
      activeLink: 'user'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      if (window.gon && gon.global && gon.global.user) {
        this.options.links[0].name = gon.global.user.name;
        this.options.links[1].url = gon.global.user.profile;
        this.options.links[2].url = gon.global.user.logout;
      }

      this.render();
    },

    /**
     * Event handler executed when the active option of the dropdown is changed
     * @param {string} id - active option's id
     */
    _onChangeDropdown: function (id) {
      var link = _.findWhere(this.options.links, { id: id });
      Turbolinks.visit(link.url);
    },

    render: function () {
      new App.View.DropdownSelectorView({
        el: '.js-user-links',
        options: this.options.links,
        activeOption: _.findWhere(this.options.links, { id: this.options.activeLink }),
        fixedOption: true,
        onChangeCallback: this._onChangeDropdown.bind(this),
        align: 'right',
        arrowPosition: null
      });
    }
  });
})(this.App));
