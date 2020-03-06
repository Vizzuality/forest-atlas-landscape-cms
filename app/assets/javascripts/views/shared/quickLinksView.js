((function (App) {
  'use strict';

  var Collection = Backbone.Collection.extend({
    url: '/management.json',
    parse: function (data) {
      return data.map(function (site) {
        var o = {};
        o.name = site.name;
        o.slug = site.slug;
        return o;
      });
    }
  });

  App.View.QuickLinksView = Backbone.View.extend({
    collection: new Collection(),

    defaults: {
      // List of links
      // NOTE: follow the syntax of the options of the dropdown component but
      // add an attribute with the actual URL
      // NOTE: if you plan to change the default links, please take care
      // at their modification in the initialize method
      links: [
        { id: 'admin', name: 'Admin', url: '/admin' },
        { id: 'management', name: 'Management', url: '/management' },
        { id: 'contexts', name: 'Contexts', url: '/contexts', separator: true }
      ],
      // id of the active link
      activeLink: 'management',
      // Format of the site URL
      // NOTE: ":slug" will be replaced
      siteUrlFormat: '/management/sites/:slug/site_pages'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      let siteSlug = window.location.href.match(/\/sites\/(\S+)\//);
      siteSlug = siteSlug ? siteSlug[1] : '';
      let userSiteRole = gon.global.user.user_site_roles.filter((userSite) => {
        return userSite.site_slug === siteSlug;
      });
      userSiteRole = userSiteRole.length ? userSiteRole[0].role : "";
      if (userSiteRole === 'publisher') {
        for(var i = this.options.links.length; i--;) {
          if (this.options.links[i]['id'] === 'admin' ||
              this.options.links[i]['id'] === 'contexts') {
            this.options.links.splice(i, 1);
          }
        }
      }

      // TODO: Clement, these rules have change, let's discuss this
      // If the user isn't an admin, we remove the admin option
      // if (!window.gon || !gon.global || !gon.global.admin) {
      //   this.options.links.splice(1, 1);
      // }

      this.collection.fetch()
        .done(function () {
          // We add the links related to the sites
          this.options.links = this.options.links.concat(this._getSiteLinks());
        }.bind(this))
        .fail(function () {
          throw new Error('Unable to load the lists of site for the Quick Links component.');
        })
        .always(this.render.bind(this));
    },

    /**
     * Event handler executed when the active option of the dropdown is changed
     * @param {string} id - active option's id
     */
    _onChangeDropdown: function (id) {
      var link = _.findWhere(this.options.links, { id: id });
      window.location.href = link.url;
    },

    /**
     * Return the list of links related to the sites
     * @returns {object[]}
     */
    _getSiteLinks: function () {
      return this.collection.toJSON().map(function (site) {
        return {
          id: site.slug,
          name: site.name,
          url: this.options.siteUrlFormat.replace(':slug', site.slug)
        };
      }, this);
    },

    render: function () {
      new App.View.DropdownSelectorView({
        el: '.js-quick-links',
        options: this.options.links,
        activeOption: _.findWhere(this.options.links, { id: this.options.activeLink }),
        onChangeCallback: this._onChangeDropdown.bind(this),
        arrowPosition: 'left',
        fixedWidth: true
      });
    }
  });
})(this.App));
