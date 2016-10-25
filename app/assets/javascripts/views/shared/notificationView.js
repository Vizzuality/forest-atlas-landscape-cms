((function (App) {
  'use strict';

  App.View.NotificationView = Backbone.View.extend({


    defaults: {
      // (Default) visibility of the notification
      visible: false,
      // Whether the notification has a close button
      closeable: true,
      // Time for the notification to close automatically in seconds
      // Set the value -1 to disable the feature
      // Shouldn't be less than 5 (for accessibility)
      autoCloseTimer: -1,
      // Type of the notification, can be: 'success', 'warning' or 'error'
      // The type can't be changed after instantiation
      type: 'success',
      // Content of the notification, HTML will not be interprated
      content: ''
    },

    events: {
      'click .js-close': '_onClickClose',
      'keydown .js-close': '_onKeydownClose'
    },

    template: HandlebarsTemplates['shared/notification'],

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);

      this._createEl();
      this.render();

      if (this.options.visible) {
        this.show();
      }
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
      this.options.visible = true;
      this.render();

      if (this.options.autoCloseTimer !== -1) {
        setTimeout(this.hide.bind(this), this.options.autoCloseTimer * 1000);
      }
    },

    /**
     * Hide the notification
     */
    hide: function () {
      this.options.visible = false;
      this.render();
    },

    /**
     * Toggle the visibility of the notification
     */
    toggle: function () {
      if (this.options.visible) this.show();
      else this.hide();
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
     * Render the content of the notification
     */
    render: function () {
      this.el.classList[this.options.visible ? 'add' : 'remove']('-visible');
      this.el.setAttribute('aria-hidden', !this.options.visible);

      // Render the content of the notification
      this.el.innerHTML = this.template({
        content: this.options.content,
        closeable: this.options.closeable,
        visible: this.options.visible
      });
      this.setElement(this.el);

      if (this.options.closeable) {
        this.el.querySelector('.js-close').focus();
      }
    }

  });
})(this.App));
