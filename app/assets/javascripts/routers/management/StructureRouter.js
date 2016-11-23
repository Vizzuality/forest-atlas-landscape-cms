((function (App) {
  'use strict';

  App.Router.ManagementStructure = Backbone.Router.extend({

    routes: {
      '(:state)(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function (state) {
      // We initialize the site switcher
      new App.View.SiteSwitcherView({
        el: $('.js-site-switcher'),
        urlFormat: '/management/sites/:slug/structure',
        slug: this.slug
      });

      // We initialize the tabs
      new App.View.TabView({
        el: $('.js-tabs'),
        redirect: true,
        currentTab: 0,
        tabs: [
          { name: 'Site\'s structure', url: '/management/sites/' + this.slug + '/structure' },
          { name: 'Pages', url: '/management/sites/' + this.slug + '/site_pages' }
          // { name: 'Widgets', url: '/management/sites/' + this.slug + '/widgets' }
        ]
      });

      this.treeContainer = document.querySelector('.js-tree');

      // We build the tree structure of the site
      this.treeStructureView = new App.View.TreeStructureView({
        el: this.treeContainer,
        collection: new Backbone.Collection(gon.structure),
        pageTemplate: this._getPageTemplate(),
        additionalPageTemplate: this._getAdditionalPageTemplate(),
        moveCallback: this._onMovePage.bind(this),
        renderCallback: this._onRenderTree.bind(this)
      });

      // We attach event listeners for the buttons in the action bar
      $('.js-submit').on('click', this._onClickSubmit.bind(this));
      $('.js-reset').on('click', this._onClickReset.bind(this));

      // If the tree has been saved successfully, we display a notification
      if (state && state === 'success') {
        new App.View.NotificationView({
          content: 'The structure has been successfully saved!',
          closeable: false,
          autoCloseTimer: 5,
          visible: true
        });

        this.navigate('/', { replace: true });
      }
    },

    /**
     * Event handler for when the submit button is clicked
     * @param {object} e - event object
     */
    _onClickSubmit: function (e) {
      e.preventDefault();

      this._hideSaveWarning();
      this._hideVisibilityWarning();
      this._hideErrorNotification();
      this._displaySavingNotification();

      $.ajax({
        url: gon.updateStructurePath,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ collection: [this.treeStructureView.getTree()] })
      }).fail(function () {
        this._hideSavingNotification();
        this._displayErrorNotification();
      }.bind(this));
    },

    /**
     * Event handler for when the reset button is clicked
     * @param {object} e - event object
     */
    _onClickReset: function (e) {
      e.preventDefault();
      this._hideSaveWarning();
      this._hideVisibilityWarning();
      this._hideSavingNotification();
      this._hideErrorNotification();
      this.treeStructureView.reset();
    },

    /**
     * Callback for when a page is moved
     */
    _onMovePage: function () {
      // We let the user know they must not forget to save before leaving the page
      this._displaySaveWarning();
    },

    /**
     * Callback for when the tree is rendered
     */
    _onRenderTree: function () {
      $(this.treeContainer).find('.js-enable').on('click', this._onClickEnable.bind(this));
      $(this.treeContainer).find('.js-disable').on('click', this._onClickDisable.bind(this));
      $(this.treeContainer).find('.js-add').on('click', this._onClickAddPage.bind(this));
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
     * Event listener for when the add page button is clicked
     * @param {object} e - event object
     */
    _onClickAddPage: function (e) {
      e.preventDefault();
      var node = $(e.target).closest('.js-draggable')[0];
      window.location = '' + gon.addPagePath + '?parent=' + $(node).attr('id').match(/\d+/)[0];
    },

    /**
     * Return the template of a page
     * @returns {string} template
     */
    _getPageTemplate: function () {
      return '\
        <span>{{name}}</span>\
        <ul class="action-buttons">\
          {{#if disableable}}\
            {{#if enabled}}\
                <li><button class="view-button js-disable">Disable</button></li>\
            {{else}}\
                <li><button class="view-button-slashed js-enable">Enable</button></li>\
            {{/if}}\
          {{/if}}\
          <li><a href="{{#if editUrl}}{{editUrl}}{{else}}{{editurl}}{{/if}}" class="edit-button">Edit</a></li>\
          {{#if disableable}}\
            <li><a rel="nofollow" data-method="delete" data-confirm="Are you sure you want to delete this page?" href="{{#if deleteUrl}}{{deleteUrl}}{{else}}{{deleteurl}}{{/if}}" class="delete-button">Delete</a></li>\
          {{/if}}\
        </ul>\
      ';
    },

    /**
     * Return the template for the additional pages located at the end of each branch
     * @returns {string} template
     */
    _getAdditionalPageTemplate: function () {
      return '<button type="button" class="js-add add-page-button">Add page</button>';
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

    /**
     * Hide the warning to remember the user that if they enable a page
     * that as disabled ancestors, it won't be visible until they are all enabled
     */
    _hideVisibilityWarning: function () {
      if (this.visibilityNotification) {
        this.visibilityNotification.hide();
      }
    },

    /**
     * Display a notification to inform the user the tree is saving
     */
    _displaySavingNotification: function () {
      if (this.savingNotification) {
        this.savingNotification.show();
        return;
      }

      this.savingNotification = new App.View.NotificationView({
        content: 'Saving the structure...',
        closeable: false,
        visible: true
      });
    },

    /**
     * Hide the notification to inform the user the tree is saving
     */
    _hideSavingNotification: function () {
      if (this.savingNotification) {
        this.savingNotification.hide();
      }
    },

    /**
     * Display an error if the structure couldn't be saved in the backend
     */
    _displayErrorNotification: function () {
      if (this.errorNotification) {
        this.errorNotification.show();
        return;
      }

      this.errorNotification = new App.View.NotificationView({
        content: 'The changes couldn\'t be saved',
        type: 'error',
        visible: true
      });
    },

    /**
     * Hide the error telling the user the structure couldn't be saved
     */
    _hideErrorNotification: function () {
      if (this.errorNotification) {
        this.errorNotification.hide();
      }
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

      var rootNode = this.treeStructureView.getTree();
      var newTree = this._toggleEnableRecursive(rootNode, nodeId, [], enable);
      this.treeStructureView.setTree(newTree);
    }
  });
})(this.App));
