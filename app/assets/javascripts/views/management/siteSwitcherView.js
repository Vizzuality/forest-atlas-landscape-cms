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

  App.View.SiteSwitcherView = Backbone.View.extend({

    tagName: 'select',
    className: 'c-site-switcher',
    template: HandlebarsTemplates['management/site-switcher'],
    collection: new Collection(),

    defaults: {
      // URL to which the user will be redirected; ":slug" will be replaced by the selected option's value
      urlFormat: '/management/sites/:slug/site_pages'
    },

    events: {
      'change': '_onChange'
    },

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);

      this.collection.fetch()
        .done(this.render.bind(this))
        .error(function () {
          throw new Error('Unable to load the lists of site for the site switcher selector.');
        });
    },

    /**
     * Compute the URL to redirect the user to
     * @param  {String} site's slug
     * @return {String} url to redirect to
     */
    _computeUrl: function (slug) {
      return this.options.urlFormat.replace(':slug', slug);
    },

    _onChange: function (e) {
      var selectedSite = this.collection.toJSON()[e.target.selectedIndex - 1];
      Turbolinks.visit(this._computeUrl(selectedSite.slug));
    },

    render: function () {
      this.$el.html(this.template({
        sites: this.collection.toJSON()
      }));
    }

  });
})(this.App));
