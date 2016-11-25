((function (App) {
  'use strict';

  App.View.TreeStructureView = Backbone.View.extend({

    tagName: 'div',
    className: 'c-tree-structure',
    template: HandlebarsTemplates['management/tree-structure'],
    collection: new Backbone.Collection(),

    defaults: {
      // If tree, the nodes can't be dragged
      readOnly: false,
      // Template for each page (string)
      // The template must be wrapped in the following div with at least these attributes
      // Can't be modified after intantiation
      pageTemplate: '<div class="page js-handle"></div>',
      // Template for the page added at the end of each branch
      // Can't be modified after intantiation
      additionalPageTemplate: null,
      // Maximum level for nested nodes
      maxNestedLevel: 4,
      // Method called after a node has been moved
      moveCallback: function () {},
      // Method called after the tree has been rendered (typically for attaching event
      // listeners to the pages)
      renderCallback: function () {}
    },

    events: {
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      // We save the initial collection so we can reset it if needed
      // We need to deep clone it to avoid mutations of the models
      this.initialCollection = this._deepCloneCollection(this.collection);

      // We register partials for the page template
      Handlebars.registerPartial('pageTemplate', this.options.pageTemplate);
      if (this.options.additionalPageTemplate) {
        Handlebars.registerPartial('additionalPageTemplate', this.options.additionalPageTemplate);
      }

      this.render();
      this.setElement(this.el);
    },

    /**
     * Event handler for when a page is successfully dragged and dropped in the tree
     */
    _onRelocate: function () {
      this._saveStructure();
      this.render();
      this.setElement(this.el);

      // We call the callback to let the user perform some actions
      this.options.moveCallback();
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
        maxLevels: this.options.maxNestedLevel,
        isTree: true,
        placeholder: 'page -placeholder',
        forcePlaceholderSize: true,
        errorClass: '-invalid',
        protectRoot: true, // Prevent the root to be changed
        isAllowed: this._isDropAllowed.bind(this),
        relocate: this._onRelocate.bind(this),
        start: this._onDrag
      });
    },

    /**
     * Event handler called when the user starts dragging a node
     * @param {object} e - event
     * @param {object} ui - jquery ui
     */
    _onDrag: function (e, ui) {
      // If the node is readonly, we prevent the user from dragging it
      if (ui.item.hasClass('js-readonly')) {
        // It seems to be a bug from jQuery: if we don't use the setTimeout, we
        // get an unpredictable behaviour with JS errors
        setTimeout(function () {
          $(this).sortable('cancel');
        }.bind(this), 0);
      }
    },

    /**
     * Return true if the page currently being dragged can be dropped at the current position
     * @param {object} placeholder - dragged page's placeholder element
     * @param {object} placeholderParent - parent of the placeholder element
     */
    _isDropAllowed: function (placeholder, placeholderParent) {
      // We allow the element to be dragged in the root element
      // This condition needs to be here because placeholderParent is undefined in this case
      if (placeholder.parent().hasClass('js-tree-root')) return true;

      // We don't want the dragged element to be nested under a non-nestable page
      if (placeholderParent.hasClass('js-not-nestable')) return false;

      // We don't want the dragged element to be placed after a non-nestable page
      // The button should be the last element of a list, so we check the position of the placeholder (to not be the last)
      // There's an exception: if we nest the dragged element inside another which hasn't any nested yet
      var parentNestedElements = placeholder.parent().children();
      var placeholderIndex = parentNestedElements.index(placeholder);
      if (placeholderIndex === parentNestedElements.length - 1 &&
        parentNestedElements.length > 1 &&
        parentNestedElements[placeholderIndex - 1].classList.contains('js-last-node')) {
        return false;
      }

      return true;
    },

    /**
     * Normalize an object representing a branch of the tree by converting the string ids
     * as int ids
     * NOTE: the method is recursive to normalize its children
     *
     * @argument {object} branch
     * @returns {object} normalized branch
     */
    _normalizeData: function (branch, parentId, position) {
      branch.id = +branch.id; // Quick way to convert to int
      branch.parent = +parentId;
      branch.position = position;
      if (branch.children) {
        branch.children.forEach(function (subBranch, index) {
          this._normalizeData(subBranch, branch.id, index);
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
          return this._normalizeData(item, null, 0);
        }, this);

      // We then replace the whole collection with the new structure
      this.collection.reset(structure);
    },

    /**
     * Return a deep clone of a collection
     * This method considers the collection to have onely one root models
     * @param   {object} collection - Backbone collection to clone
     * @returns {object} deep clone
     */
    _deepCloneCollection: function (collection) {
      return new Backbone.Collection(collection.length > 0 ? [$.extend(true, {}, collection.toJSON()[0])] : []);
    },

    /**
     * Return the tree
     * @returns {object} root of the tree
     */
    getTree: function () {
      return this._deepCloneCollection(this.collection).toJSON()[0];
    },

    /**
     * Set the tree used by the library
     * @param {object} newTree
     */
    setTree: function (newTree) {
      this.collection.reset(newTree);
      this.render();
      this.setElement(this.el);
    },

    /**
     * Restore the tree to its original state
     */
    reset: function () {
      this.setTree(this._deepCloneCollection(this.initialCollection).toJSON());
    },

    render: function () {
      this.$el.html(this.template({
        pages: this.collection.toJSON(),
        hasAdditionalPage: !!this.options.additionalPageTemplate,
        readOnly: this.options.readOnly
      }));

      if (!this.options.readOnly) this._initSortableTree();

      this.options.renderCallback();
    }
  });
})(this.App));
