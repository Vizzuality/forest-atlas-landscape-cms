((function (App) {
  'use strict';

  App.View.DashboardBookmarksView = Backbone.View.extend({

    className: 'c-dashboard-bookmarks',
    template: HandlebarsTemplates['front/dashboard-bookmarks'],

    defaults: {
      // Callback to retrieve the global state of the dashboard
      getState: function () { },
      // Callback to set the global state of the dashboard
      setState: function () { },
      // Name of the key in the local storage
      storageID: 'bookmarks'
    },

    events: {
      'click .js-add-state': '_onClickAddState',
      'keydown .js-name': '_onKeydownName',
      'click .js-apply': '_onClickApply',
      'click .js-delete': '_onClickDelete'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render();
    },

    /**
     * Event handler for the click on the "add state" button
     */
    _onClickAddState: function () {
      this._saveBookmark(this.options.getState());
      this.render();
    },

    /**
     * Event handler for when editing the name of a bookmark
     */
    _onKeydownName: function (e) {
      if (e.keyCode !== 13) return; // enter key
      e.preventDefault();
      var id = +e.currentTarget.dataset.id;
      this._editBookmark(id, { name: e.currentTarget.textContent });
      e.currentTarget.blur();
    },

    /**
     * Event handler for the click on the "apply state" buttons
     * @param {object} e - event object
     */
    _onClickApply: function (e) {
      var id = +e.currentTarget.dataset.id;
      var bookmark = this._getBookmark(id);
      this.options.setState(bookmark);
    },

    /**
     * Event handler for the click on the "delete bookmark" buttons
     * @param {object} e - event object
     */
    _onClickDelete: function (e) {
      var id = +e.currentTarget.dataset.id;
      this._deleteBookmark(id);
      this.render();
    },

    /**
     * Retrieve the bookmarks from the local storage and return them
     * @returns {object[]} bookmarks
     */
    _getBookmarks: function () {
      var bookmarks;

      try {
        bookmarks = JSON.parse(localStorage.getItem(this.options.storageID)) || [];
      } catch (err) {
        // We delete what's in the local storage so we can move forward
        localStorage.removeItem(this.options.storageID);

        // We display an error
        new App.View.NotificationView({
          visible: true,
          type: 'error',
          content: 'The bookmarks have been corrupted and can\'t be retrieved'
        });
      }

      return bookmarks || [];
    },

    /**
     * Retrieve a specific bookmark from the local storage
     * @param {number} id - index of the bookmark
     */
    _getBookmark: function (id) {
      var bookmarks = this._getBookmarks();
      return bookmarks[id];
    },

    /**
     * Create a new bookmark and store the state within
     * @param {object} state
     */
    _saveBookmark: function (state) {
      var bookmarks = this._getBookmarks();
      bookmarks.push(state);

      try {
        localStorage.setItem(this.options.storageID, JSON.stringify(bookmarks));
      } catch (err) {
        // We display an error
        new App.View.NotificationView({
          visible: true,
          type: 'error',
          content: 'The bookmark couldn\'t be saved properly'
        });
      }
    },

    /**
     * Edit a bookmark and stores its new copy in the local storage
     * @param {number} id - index of the bookmark
     * @param {object} changes - object containing the modifications
     */
    _editBookmark: function (id, changes) {
      var bookmarks = this._getBookmarks();
      bookmarks[id] = Object.assign({}, bookmarks[id], changes);

      try {
        localStorage.setItem(this.options.storageID, JSON.stringify(bookmarks));
      } catch (err) {
        // We display an error
        new App.View.NotificationView({
          visible: true,
          type: 'error',
          content: 'The name of the bookmark couldn\'t be updated'
        });
      }
    },

    /**
     * Delete a bookmark from the local storage
     * @param {number} id - index of the bookmark
     */
    _deleteBookmark: function (id) {
      var bookmarks = this._getBookmarks();
      bookmarks.splice(id, 1);

      var couldSave = false;
      try {
        localStorage.setItem(this.options.storageID, JSON.stringify(bookmarks));
        couldSave = true;
      } catch (err) {
        // We display an error
        new App.View.NotificationView({
          visible: true,
          type: 'error',
          content: 'The bookmark couldn\'t be deleted'
        });
      }

      if (couldSave) {
        new App.View.NotificationView({
          visible: true,
          autoCloseTimer: 5,
          content: 'The bookmark has been successfully deleted!'
        });
      }
    },

    render: function () {
      this.el.classList.add(this.className);
      this.el.innerHTML = this.template({
        bookmarks: this._getBookmarks()
      });
      this.setElement(this.el);
    }

  });
})(this.App));
