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
      urlFormat: '/management/sites/:slug/site_pages',
      // Slug of the current site
      slug: null
    },

    events: {
      'change': '_onChange'
    },

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);

      this.collection.fetch()
        .done(this.render.bind(this))
        .fail(function () {
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
      var slug = selectedSite.slug;

      // Just before redirecting the user to the new page, we update the selector
      // The reason is because the page could take a few moments to load, we don't
      // want the user to see the option not fitting into the select which had its
      // width computed for the previous option
      // By rendering again, we make sure that's it's visually ok while loading
      this.options.slug = slug;
      this.render();

      Turbolinks.visit(this._computeUrl(slug));
    },

    render: function () {
      this.$el.html(this.template({
        sites: this.collection.toJSON()
          .map(function (site) {
            site.active = site.slug === this.options.slug;
            return site;
          }, this),
        slug: this.options.slug,
        // Basically, we want the width of the select input to be the width of its content
        // Because it's not possible with CSS, we base the width of the input on the length of
        // the content and then use it with the "ch" unit (which is roughly the width of the
        // character "0")
        // There's an offset of 2ch to compensate the left padding for the arrow and as an error
        // margin
        width: (this.options.slug.length + 2) + 'ch'
      }));
    }

  });
})(this.App));
