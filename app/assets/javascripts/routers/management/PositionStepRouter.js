((function (App) {
  'use strict';

  App.Router.ManagementPositionStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      this.structure = (window.gon && gon.structure) || null;

      this.treeContainer = document.querySelector('.js-tree');

      this.treeStructureView = new App.View.TreeStructureView({
        el: this.treeContainer,
        collection: new Backbone.Collection(this._getTreeStructure()),
        pageTemplate: this._getPageTemplate(),
        additionalPageTemplate: null
      });

      /* We add a listener for when the user clicks on "Continue" */
      $('.js-form').on('submit', this._onSubmit.bind(this));
    },

    /**
     * Event handler for when the user clicks the submit button
     * @param {object} e - event
     */
    _onSubmit: function () {
      // We retrieve the position and the parentId of the draggable node
      var position,
        parentId;

      var searchNode = function (currentNode, currentParentId, currentPosition) {
        // If the current node is the one we search for, we save its position and
        // parent ID and return true (meaning we found it)
        if (currentNode.id === 0) {
          position = currentPosition;
          parentId = currentParentId;
          return true;
        }

        // We search for the node in the children list
        for (var i = 0, j = (currentNode.children && currentNode.children.length) || 0; i < j; i++) {
          // If we found it, we return
          if (searchNode(currentNode.children[i], currentNode.id, i)) {
            return true;
          }
        }

        // If we couldn't find it, we return false
        return false;
      };

      if (!searchNode(this.treeStructureView.getTree(), null, 0)) {
        // eslint-disable-next-line no-console
        console.warn('Unable to find the dragged node in the tree');
        return;
      }

      // We save the value to the hidden fields
      $('.js-parent_id').val(parentId);
      $('.js-position').val(position);
    },

    /**
     * Return the tree structure with readonly nodes and a special
     * node that can be dragged
     */
    _getTreeStructure: function () {
      // Position of the "Drag this" item if editing a page
      var draggable = {
        position: (window.gon && gon.position !== null && gon.position !== undefined) ? gon.position : null,
        parentId: (window.gon && gon.parentId !== null && gon.parentId !== undefined) ? gon.parentId : null
      };

      /**
       * Recursively parse the nodes so they have the desired structure
       * @param {object} node - node/branch to parse
       * @param {number} level - nesting level of the node
       * @returns {object} tree
       */
      var parseNode = function (node, level) {
        if (level !== 0) node.readonly = true;

        for (var i = 0, j = (node.children && node.children.length) || 0; i < j; i++) {
          node.children[i] = parseNode(node.children[i], level + 1, node.id);

          // If the element is the draggable, we remove its readonly attribute
          if (node.id === draggable.parentId && i === draggable.position) {
            delete node.children[i].readonly;
            node.children[i].id = 0;
            node.children[i].name = 'Drag this';
            node.children[i].enabled = true;
            node.children[i].highlighted = true;
          }
        }

        // We insert as first page our draggable node if not editing
        if (draggable.position === null && level === 0) {
          node.children.unshift({
            name: 'Drag this',
            id: 0,
            enabled: true,
            highlighted: true
          });
        }

        return node;
      };

      return parseNode(this.structure, 0);
    },

    /**
     * Return the template for a page in the tree
     * @returns {string} template
     */
    _getPageTemplate: function () {
      return '\
        <div class="page {{#unless enabled}} -disabled {{else}}{{#unless visible}} -disabled {{/unless}}{{/unless}}{{#unless show_on_menu}} -detached{{/unless}} js-handle">\
          <span>{{name}}</span>\
        </div>\
      ';
    }

  });
})(this.App));
