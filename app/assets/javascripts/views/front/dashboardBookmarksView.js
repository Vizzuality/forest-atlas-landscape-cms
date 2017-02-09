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
      'click .js-add-bookmark': '_onClickAddBookmark',
      'focusin .js-bookmark': '_onFocusinBookmark',
      'focusout .js-bookmark': '_onFocusoutBookmark',
      'click .js-apply': '_onClickApply',
      'click .js-edit': '_onClickEdit',
      'click .js-delete': '_onClickDelete',
      'blur .js-name': '_onKeydownName',
      'keydown .js-name': '_onKeydownName'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render();
    },

    /**
     * Event handler for the (input) focus on the bookmark
     * @param {Event} e - event
     */
    _onFocusinBookmark: function (e) {
      e.currentTarget.classList.add('-active');
    },

    /**
     * Event handler for the (output) focus on the bookmark
     * @param {Event} e - event
     */
    _onFocusoutBookmark: function (e) {
      var target = e.relatedTarget;
      var bookmark = e.currentTarget;
      var isActive = !!$(target).closest(bookmark).length;
      bookmark.classList.toggle('-active', isActive);
    },

    /**
     * Event handler for the click on the "add bookmark" button
     */
    _onClickAddBookmark: function () {
      var bookmarks = this._getBookmarks();
      var bookmark = this.options.getState();

      var bookmarkName = 'Bookmark #' + (bookmarks.length + 1);
      bookmark.name = bookmarkName;

      this._saveBookmark(bookmark);
      this.render();
    },

    /**
     * Event handler for when editing the name of a bookmark
     */
    _onKeydownName: function (e) {
      if (e.keyCode && e.keyCode !== 13) return; // enter key
      e.preventDefault();

      var nameContainer = e.currentTarget;
      var bookmark = $(nameContainer).closest('.js-bookmark')[0];
      var id = +nameContainer.dataset.id;
      var name = nameContainer.textContent;
      if (!name.length) name = this.options.getState().name;

      // We remove the editable attribute
      nameContainer.setAttribute('contenteditable', false);

      // We save the change
      this._editBookmark(id, { name: name });

      // We also update the name of the apply button
      bookmark.querySelector('.js-apply').textContent = name;

      // We make the element active again
      bookmark.focus();
      bookmark.classList.remove('-no-active');
    },

    /**
     * Event handler for the click on the "apply bookmark" button
     * @param {object} e - event object
     */
    _onClickApply: function (e) {
      var id = +e.currentTarget.dataset.id;
      var bookmark = this._getBookmark(id);
      this.options.setState(bookmark);
    },

    /**
     * Event handler for the click on the "edit bookmark" button
     * @param {object} e - event object
     */
    _onClickEdit: function (e) {
      var bookmark = $(e.currentTarget).closest('.js-bookmark')[0];
      var nameContainer = bookmark.querySelector('.js-name');

      // We don't want the options to appear on top
      bookmark.classList.add('-no-active');

      // We make the name editable
      nameContainer.setAttribute('contenteditable', true);
      nameContainer.focus();
    },

    /**
     * Event handler for the click on the "delete bookmark" button
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
        App.notifications.broadcast(App.Helper.Notifications.dashboard.bookmarks.corrupted);
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
        App.notifications.broadcast(App.Helper.Notifications.dashboard.bookmarks.saveError);
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
        App.notifications.broadcast(App.Helper.Notifications.dashboard.bookmarks.updateError);
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
        App.notifications.broadcast(App.Helper.Notifications.dashboard.bookmarks.deleteError);
      }

      if (couldSave) {
        App.notifications.broadcast(App.Helper.Notifications.dashboard.bookmarks.deletion);
      }
    },

    render: function () {
      this.el.classList.add(this.className);
      this.el.innerHTML = this.template({
        bookmarks: this._getBookmarks(),
        template: window.template || 'fa'
      });
      this.setElement(this.el);
    }

  });
})(this.App));
