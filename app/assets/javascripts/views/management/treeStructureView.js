((function (App) {
  'use strict';

  App.View.TreeStructureView = Backbone.View.extend({

    tagName: 'div',
    className: 'c-tree-structure',
    template: HandlebarsTemplates['management/tree-structure'],
    collection: new Backbone.Collection(),

    events: {
      'click .js-enable': '_onClickEnable',
      'click .js-disable': '_onClickDisable'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      this.render();
      this.setElement(this.el);
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
          this.setElement(this.el);
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

    render: function () {
      this.$el.html(this.template({
        pages: this.collection.toJSON()
      }));

      this._initSortableTree();
    },

    save: function (path) {
      $.ajax({
        url: path,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(this)
      });
    },

    /**
     * Event listener for when the enable button is clicked on a node
     * @param {object} e - event object
     */
    _onClickEnable: function (e) {
      e.preventDefault();
      var node = $(e.target).closest('.js-draggable')[0];
      this.toggleEnable(node, true);
    },

    /**
     * Event listener for when the disable button is clicked on a node
     * @param {object} e - event object
     */
    _onClickDisable: function (e) {
      e.preventDefault();
      var node = $(e.target).closest('.js-draggable')[0];
      this.toggleEnable(node, false);
    },

    /**
     * Recursively, toggle the enabled attribute of the subtree whose root is designated
     * If nodeId is null, toggle the attribute for all the nodes / subtree
     * @param {object}   currentNode - the current node / subtree
     * @param {number}   nodeId - id of the target node, can be null
     * @enable {boolean} enable - whether to enable or disable the subtree
     */
    _toggleEnableRecursive: function (currentNode, nodeId, enable) {
      var newNode = currentNode;
      var isTargetedNode = !nodeId || currentNode.id === nodeId;

      // TODO: shouldn't be able to enable a node if it's parent is disabled

      if (isTargetedNode) {
        newNode.enabled = enable;
      }

      if (newNode.children) {
        newNode.children = newNode.children.map(function (childNode) {
          return this._toggleEnableRecursive(childNode, isTargetedNode ? null : nodeId, enable);
        }, this);
      }

      return newNode;
    },

    /**
     * Toggle the visibility of a node
     * @param {object}  node - DOM element
     * @param {boolean} enable - whether to enable or disable
     */
    toggleEnable: function (node, enable) {
      var nodeId = node.id.match(/^page-(\d+)/);

      if (!nodeId || nodeId.length < 2) {
        // TODO: the user clicked on the root
        return;
      }

      nodeId = +nodeId[1];

      var rootNode = this.collection.toJSON()[0];
      var newTree = this._toggleEnableRecursive(rootNode, nodeId, enable);

      this.collection.reset(newTree);
      this.render();
      this.setElement(this.el);
    }
  });
})(this.App));
