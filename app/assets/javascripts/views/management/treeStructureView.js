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

      // We save the initial collection so we can reset it if needed
      this.initialCollection = new Backbone.Collection(this.collection.toJSON());

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
          // We let the user know they must not forget to save before leaving the page
          this._displaySaveWarning();

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

    /**
     * Display a warning to remember the user to save the tree before
     * clicking any button that would leave the page
     */
    _displaySaveWarning: function () {
      if (this.saveNotification) {
        this.saveNotification.show();
        return;
      }

      this.saveNotification = new App.View.NotificationView({
        content: 'Don\'t forget to save the changes before leaving the page!',
        type: 'warning',
        visible: true
      });
    },

    /**
     * Hide the warning remembering the user to save before leaving
     * the page
     */
    _hideSaveWarning: function () {
      if (this.saveNotification) {
        this.saveNotification.hide();
      }
    },

    /**
     * Display a warning to remember the user that if they enable a page
     * that as disabled ancestors, it won't be visible until they are all enabled
     */
    _displayVisibilityWarning: function () {
      if (this.visibilityNotification) {
        this.visibilityNotification.show();
        return;
      }

      this.visibilityNotification = new App.View.NotificationView({
        content: 'This page won\'t be visible to the users until all of its ancestors are enabled!',
        type: 'warning',
        visible: true
      });
    },

    render: function () {
      this.$el.html(this.template({
        pages: this.collection.toJSON()
      }));

      this._initSortableTree();
    },

    save: function (path) {
      this._hideSaveWarning();
      $.ajax({
        url: path,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(this)
      });
    },

    /**
     * Restore the tree to its original state
     */
    reset: function () {
      this.collection = new Backbone.Collection(this.initialCollection.toJSON());
      this.render();
      this.setElement(this.el);
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
     * @param {array}    ancestorsVisibility - visibility of the direct ancestors (true = visible)
     * @enable {boolean} enable - whether to enable or disable the subtree
     */
    _toggleEnableRecursive: function (currentNode, nodeId, ancestorsVisibility, enable) {
      var newNode = currentNode;
      // The current node is the targeted node if:
      //  1/ We're not searching for a concrete node and we want do disable the pages
      //  2/ It is effectively the targeted node :)
      var isTargetedNode = (!nodeId && !enable) || (currentNode.id === nodeId);

      if (isTargetedNode) {

        if (enable) {
          var hasDisabledAncestor = ancestorsVisibility.reduce(function (res, vis) {
            return res || !vis;
          }, false);

          // If the node we want to enable has a disabled ancestor, a warning is displayed
          // to inform the user the page won't be visible until all of its ancestors are visible
          if (hasDisabledAncestor) {
            this._displayVisibilityWarning();
          }
        }

        newNode.enabled = enable;
      }

      if (newNode.children) {
        var newAncestorsVisibility = ancestorsVisibility.concat([currentNode.enabled]);
        newNode.children = newNode.children.map(function (childNode) {
          return this._toggleEnableRecursive(childNode, isTargetedNode ? null : nodeId, newAncestorsVisibility, enable);
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
      var newTree = this._toggleEnableRecursive(rootNode, nodeId, [], enable);

      this.collection.reset(newTree);
      this.render();
      this.setElement(this.el);
    }
  });
})(this.App));
