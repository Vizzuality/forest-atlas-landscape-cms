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
      // List of links (follow the syntax of the options of the dropdown component)
      links: [
        { id: 'admin', name: 'Admin' }
      ],
      // id of the active link
      activeLink: null
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

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
     * Return the list of links related to the sites
     * @returns {object[]}
     */
    _getSiteLinks: function () {
      return this.collection.toJSON().map(function (site) {
        return {
          id: site.slug,
          name: site.name
        };
      });
    },

    render: function () {
      new App.View.DropdownSelectorView({
        el: '.js-quick-links',
        options: this.options.links,
        activeOption: _.findWhere(this.options.links, { id: this.options.activeLink }), // TODO
        onChangeCallback: function () {
          console.log('do something'); // TODO
        },
        arrowPosition: 'left',
        fixedWidth: true
      });
    }
  });
})(this.App));
