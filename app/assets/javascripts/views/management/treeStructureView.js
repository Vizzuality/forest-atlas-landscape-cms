((function (App) {
  'use strict';

  var Collection = Backbone.Collection.extend({
    // url: '/management.json',
    // parse: function (data) {
    //   return data.map(function (site) {
    //     var o = {};
    //     o.name = site.name;
    //     o.slug = site.slug;
    //     return o;
    //   });
    // }
  });

  App.View.TreeStructureView = Backbone.View.extend({

    tagName: 'div',
    className: 'c-tree-structure',
    template: HandlebarsTemplates['management/tree-structure'],
    collection: new Collection([
      {
        name: 'Home',
        id: 0
      },
      {
        name: 'Sections',
        id: 1,
        children: [
          {
            name: 'Section 1',
            id: 11
          },
          {
            name: 'Section 2',
            id: 12
          },
          {
            name: 'Section 3',
            id: 13,
            children: [
              {
                name: 'Sub-section 1',
                id: 131
              }
            ]
          }
        ]
      },
      {
        name: 'Map',
        id: 2
      }
    ]),

    events: {
    },

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);

      this.render();
      // this.collection.fetch()
      //   .done(this.render.bind(this))
      //   .fail(function () {
      //     throw new Error('Unable to load the lists of pages for the site structure tree.');
      //   });
    },

    render: function () {
      this.$el.html(this.template({
        pages: this.collection.toJSON()
      }));
    }

  });
})(this.App));
