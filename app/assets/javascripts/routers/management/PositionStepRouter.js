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
      // TODO: use the real structure instead
      // eslint-disable-next-line
      this.structure = {"id":86,"name":"Homepage","parent_id":null,"position":5,"enabled":true,"content_type":4,"disableable":false,"deleteUrl":"/management/sites/base-site/site_pages/86","editUrl":"/management/sites/base-site/site_pages/86/edit","children":[{"id":87,"name":"Map","parent_id":86,"position":0,"enabled":true,"content_type":5,"disableable":false,"deleteUrl":"/management/sites/base-site/site_pages/87","editUrl":"/management/sites/base-site/site_pages/87/edit"},{"id":88,"name":"Data","parent_id":86,"position":1,"enabled":true,"content_type":6,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/88","editUrl":"/management/sites/base-site/site_pages/88/edit"},{"id":89,"name":"Analysis Dashboard","parent_id":86,"position":2,"enabled":true,"content_type":2,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/89","editUrl":"/management/sites/base-site/site_pages/89/edit"},{"id":90,"name":"News","parent_id":86,"position":3,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/90","editUrl":"/management/sites/base-site/site_pages/90/edit","children":[{"id":92,"name":"News section 1","parent_id":90,"position":0,"enabled":false,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/92","editUrl":"/management/sites/base-site/site_pages/92/edit","children":[{"id":97,"name":"News 1","parent_id":92,"position":0,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/97","editUrl":"/management/sites/base-site/site_pages/97/edit"},{"id":98,"name":"News 2","parent_id":92,"position":1,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/98","editUrl":"/management/sites/base-site/site_pages/98/edit"},{"id":99,"name":"News 3","parent_id":92,"position":2,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/99","editUrl":"/management/sites/base-site/site_pages/99/edit"},{"id":100,"name":"News 4","parent_id":92,"position":3,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/100","editUrl":"/management/sites/base-site/site_pages/100/edit"},{"id":101,"name":"News 5","parent_id":92,"position":4,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/101","editUrl":"/management/sites/base-site/site_pages/101/edit"},{"id":102,"name":"News 6","parent_id":92,"position":5,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/102","editUrl":"/management/sites/base-site/site_pages/102/edit"}]},{"id":93,"name":"News section 2","parent_id":90,"position":1,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/93","editUrl":"/management/sites/base-site/site_pages/93/edit"},{"id":94,"name":"News section 3","parent_id":90,"position":2,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/94","editUrl":"/management/sites/base-site/site_pages/94/edit"},{"id":95,"name":"News section 4","parent_id":90,"position":3,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/95","editUrl":"/management/sites/base-site/site_pages/95/edit"},{"id":96,"name":"News section 5","parent_id":90,"position":4,"enabled":true,"content_type":1,"disableable":true,"deleteUrl":"/management/sites/base-site/site_pages/96","editUrl":"/management/sites/base-site/site_pages/96/edit"}]},{"id":91,"name":"Terms and privacy","parent_id":86,"position":4,"enabled":true,"content_type":7,"disableable":false,"deleteUrl":"/management/sites/base-site/site_pages/91","editUrl":"/management/sites/base-site/site_pages/91/edit"}]};

      this.treeContainer = document.querySelector('.js-tree');

      this.treeStructureView = new App.View.TreeStructureView({
        el: this.treeContainer,
        collection: new Backbone.Collection(this._getTreeStructure()),
        pageTemplate: this._getPageTemplate(),
        additionalPageTemplate: null
      });
    },

    /**
     * Return the tree structure with readonly nodes and a special
     * node that can be dragged
     */
    _getTreeStructure: function () {
      /**
       * Recursively parse the nodes so they have the desired structure
       * @param {object} node - node/branch to parse
       * @param {number} level - nesting level of the node
       * @returns {object} tree
       */
      var parseNode = function (node, level) {
        if (level !== 0) node.readonly = true;
        for (var i = 0, j = (node.children && node.children.length) || 0; i < j; i++) {
          node.children[i] = parseNode(node.children[i], level + 1);
        }

        // We insert as first page our draggable node
        if (level === 0) {
          node.children.unshift({
            name: 'Drag this',
            id: '-1',
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
        <div class="page {{#unless enabled}} -disabled {{/unless}} {{#if highlighted}}-highlight{{/if}} js-handle">\
          <span>{{name}}</span>\
          {{#unless enabled}}\
            <ul class="action-buttons">\
              <li><span class="view-button-slashed">Disabled</span></li>\
            </ul>\
          {{/unless}}\
        </div>\
      ';
    }

  });
})(this.App));
