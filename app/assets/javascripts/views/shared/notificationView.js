((function (App) {
  'use strict';

  App.View.NotificationView = Backbone.View.extend({


    defaults: {
      // Whether the notification can be closed by the user and can be automatically
      // closed by the JS without the user's input (should be displayed at least 5s)
      closeable: true,
      // Time for the notification to close automatically in seconds
      // The notification won't be automatically closed by the JS before this time
      // Set the value -1 to disable the feature
      // Shouldn't be less than 5 (for accessibility)
      autoCloseTimer: -1,
      // Whether to show the dialog buttons or not
      dialogButtons: false,
      // Callback exectuted when the user clicks the cancel button of the dialog
      cancelCallback: function () {},
      // Callback exectuted when the user clicks the continue button of the dialog
      continueCallback: function () {},
      // Type of the notification, can be: 'success', 'warning' or 'error'
      // The type can't be changed after instantiation
      type: 'success',
      // Content of the notification, HTML will not be interpreted
      content: '',
      // Callback executed after the notification has been hidden (after the animation)
      afterHide: function () {},
      // Visibility of the notification (internal)
      _visible: false
    },

    events: {
      'transitionend': '_onTransitionend',
      'click .js-close': '_onClickClose',
      'keydown .js-close': '_onKeydownClose',
      'click .js-dialog': '_onClickDialogButtons'
    },

    template: HandlebarsTemplates['shared/notification'],

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      // This is used to cancel any running timer
      this.timer = null;

      this._createEl();
    },

    /**
     * Create the DOM element attached to the view and insert it into the DOM
     */
    _createEl: function () {
      this.el = document.createElement('div');
      this.el.classList.add('c-notification', '-' + this.options.type);
      this.el.setAttribute('role', 'alert');
      this.el.setAttribute('aria-label', this.options.type);
      this.el.setAttribute('aria-describedby', 'notification-content');
      // For accessibility reason (tabindex), we want the notification to be the first child body
      document.body.insertBefore(this.el, document.body.firstElementChild);
    },

    /**
     * Show the notification
     */
    show: function () {
      // eslint-disable-next-line no-underscore-dangle
      this.options._visible = true;
      this.render();

      // We cancel any running timeout before setting a new one
      if (this.timer) clearTimeout(this.timer);

      if (this.options.autoCloseTimer !== -1) {
        this.timer = setTimeout(this.hide.bind(this), this.options.autoCloseTimer * 1000);
      }
    },

    /**
     * Hide the notification
     */
    hide: function () {
      // eslint-disable-next-line no-underscore-dangle
      this.options._visible = false;
      this.timer = null;
      this.render();
    },

    /**
     * Toggle the visibility of the notification
     */
    toggle: function () {
      // eslint-disable-next-line no-underscore-dangle
      if (this.options._visible) this.show();
      else this.hide();
    },

    /**
     * Set the focus on the close button
     */
    _setFocus: function () {
      if (!this.isFocusSet) {
        if (this.options.closeable) this.el.querySelector('.js-close').focus();
        if (this.options.dialogButtons) this.el.querySelector('.js-dialog button[data-action="continue"]').focus();
        this.isFocusSet = true;
      }
    },

    /**
     * Event handler called when the close button of the notification is clicked
     */
    _onClickClose: function () {
      if (this.options.closeable) {
        this.hide();
      }
    },

    /**
     * Event handler called when the a key is pressed whil the focus in on the close button
     */
    _onKeydownClose: function (e) {
      var keyCode = e.keyCode;
      // If the user presses enter or space
      if (keyCode === 13 || keyCode === 32) {
        this.hide();
        e.preventDefault();
      }
    },

    /**
     * Event handler called when the notification stops animating
     */
    _onTransitionend: function () {
      // eslint-disable-next-line no-underscore-dangle
      if (this.options._visible) {
        this._setFocus();
      } else {
        this.options.afterHide();
      }
    },

    /**
     * Event handler called when a button of the dialog is clicked
     * @param {Event} e - event
     */
    _onClickDialogButtons: function (e) {
      if (!(e.target instanceof HTMLButtonElement)) return;

      // We execute the callback
      this.options[e.target.dataset.action + 'Callback']();

      this.hide();
    },

    /**
     * Render the content of the notification
     */
    render: function () {
      this.isFocusSet = false; // Whether the focus has been set on the close button
      // eslint-disable-next-line no-underscore-dangle
      this.el.classList[this.options._visible ? 'add' : 'remove']('-visible');
      this.el.classList[this.options.dialogButtons ? 'add' : 'remove']('-dialog');
      // eslint-disable-next-line no-underscore-dangle
      this.el.setAttribute('aria-hidden', !this.options._visible);

      // Render the content of the notification
      this.el.innerHTML = this.template({
        content: this.options.content,
        closeable: this.options.closeable,
        // eslint-disable-next-line no-underscore-dangle
        visible: this.options._visible,
        dialogButtons: this.options.dialogButtons
      });
      this.setElement(this.el);
    }

  });
})(this.App));
