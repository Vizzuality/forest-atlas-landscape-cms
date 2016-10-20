((function (App) {
  'use strict';

  App.View.TreeStructureView = Backbone.View.extend({

    tagName: 'div',
    className: 'c-tree-structure',
    template: HandlebarsTemplates['management/tree-structure'],
    collection: new Backbone.Collection(),

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

    /**
     * Make the tree sortable
     */
    _initSortableTree: function () {
      this.$el.find('.js-tree-root').nestedSortable({
        listType: 'ul',
        handle: '.js-handle',
        items: '.js-draggable',
        toleranceElement: '.js-handle',
        maxLevels: 4, // Max nested level is 4
        isTree: true,
        placeholder: 'page -placeholder',
        forcePlaceholderSize: true,
        errorClass: '-invalid',
        protectRoot: true, // Prevent the root to be changed
        isAllowed: function (placeholder, placeholderParent) {
          // We allow the element to be dragged in the root element
          // This condition needs to be here because placeholderParent is undefined in this case
          if (placeholder.parent().hasClass('js-tree-root')) return true;

          // We don't want the dragged element to be nested under a "Add page" button
          if (placeholderParent.hasClass('js-not-nestable')) return false;

          // We don't want the dragged element to be placed after a "Add page" button
          // The button should be the last element of a list, so we check the position of the placeholder (to not be the last)
          // There's an exception: if we nest the dragged element inside another which hasn't any nested yet
          var parentNestedElements = placeholder.parent().children();
          if (parentNestedElements.index(placeholder) === parentNestedElements.length - 1 &&
            parentNestedElements.length > 1) {
            return false;
          }

          return true;
        },
        relocate: function () {
          this._saveStructure();
          this.render();
        }.bind(this)
      });
    },

    /**
     * Normalize an object representing a branch of the tree by converting the string ids
     * as int ids
     * NOTE: the method is recursive to normalize its children
     *
     * @argument {object} branch
     * @returns {object} normalized branch
     */
    _normalizeData: function (branch) {
      branch.id = +branch.id; // Quick way to convert to int
      if (branch.children) {
        branch.children.forEach(function (subBranch) {
          this._normalizeData(subBranch);
        }, this);
      }
      return branch;
    },

    /**
     * Retrieve the structure of the tree and save it to the server
     */
    _saveStructure: function () {
      // The ids are returned as strings so we need to convert them to ints
      var structure = this.$el.find('.js-tree-root').nestedSortable('toHierarchy', { startDepthCount: 0 })
        .map(function (item) {
          return this._normalizeData(item);
        }, this);

      // We then replace the whole collection with the new structure
      this.collection.reset(structure);

      // We finally save the collection
      // $.ajax({
      //   url: '',
      //   type: 'PUT',
      //   contentType: 'application/json',
      //   data: JSON.stringify(structure)
      // });
    },

    render: function () {
      this.$el.html(this.template({
        pages: this.collection.toJSON()
      }));

      this._initSortableTree();
    }

  });
})(this.App));
