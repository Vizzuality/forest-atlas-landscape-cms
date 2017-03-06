((function (App) {
  'use strict';

  App.View.NotificationsView = Backbone.View.extend({

    el: 'body',

    defaults: {
      // List of notifications to display (FIFO)
      pool: [],
      // The first notification id will be lastId + 1
      lastId: -1,
      // Number of seconds a notification must at least be displayed before
      // being autoclosed by the JS to display the next one
      // NOTE: can be overriden by the autoCloseTimer value of the notification
      // Shouldn't be less than 5 (for accessibility)
      minimumDisplayTime: 5,
      // Whether the current notification can be hidden to display the next one
      _canAutoCloseNotification: false
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
    },

    /**
     * Display a notification to the user according to the configuration and
     * return its id
     * NOTE: the notification can be delayed if the previous is still being displayed
     * NOTE: the notification may be automatically hidden after 5 seconds if a new
     * one is broadcasted
     * NOTE: uncloseable notifications won't be automatically hidden and will be
     * blocking for the next ones to be displayed
     * @param {object} config - configuration of the notification
     * @return {number} id - notification ID
     */
    broadcast: function (config) {
      var notification = new App.View.NotificationView(config);
      notification.options.id = ++this.options.lastId;

      // This rAF is needed for the first notification to appear with a animation
      requestAnimationFrame(function () {
        var poolSize = this.options.pool.push(notification);

        if (poolSize === 1) this._displayNotification();
        // If the previous notification can be auto closed, then we hide it, which
        // will trigger the next one to be shown
        else if (poolSize > 1 && this.options.pool[0].options.closeable &&
          this.options._canAutoCloseNotification) {  // eslint-disable-line no-underscore-dangle
          this.options.pool[0].hide();
        }
      }.bind(this));

      return notification.options.id;
    },

    /**
     * Hide the notification designated by its id
     * NOTE: the notification may already be hidden
     * NOTE: if the notification haven't been displayed yet, it
     * won't appear
     * @param {number} notificationId - notification ID
     */
    hide: function (notificationId) {
      var poolSize = this.options.pool.length;
      if (poolSize === 0) return;

      var currentNotification = this.options.pool[0];

      // If the currently displayed notification has an id greater than the one we're
      // looking for, then the notification already disappeared
      if (currentNotification.options.id > notificationId) return;

      if (currentNotification.options.id === notificationId) {
        // If the notification we want to hide is the one displayed, we just hide it
        currentNotification.hide();
      } else if (poolSize > 1) {
        for (var i = 1, j = poolSize - 1; i < j; i++) {
          var notification = this.options.pool[i];
          if (notification.options.id === notificationId) {
            // We do not hide the notification because it hasn't been displayed yet,
            // we just remove it from the pool
            this.options.pool.splice(i, 1);
            break;
          }
        }
      }
    },

    /**
     * Bubbles an event with the provided config
     * @param {{ type: string, content: string }} config - bubble config
     */
    display: function (config) {
      switch(config.type) {
        case 'WidgetDeletionError':
          new App.View.WidgetDeletionErrorModal({ widget: gon.widgetPages[config.content] });
          break;
        default:
      }
    },

    /**
     * Display the oldest notification
     */
    _displayNotification: function () {
      // This rAF is needed for the notification to appear with a animation
      requestAnimationFrame(function () {
        var notification = this.options.pool[0];
        notification.options.afterHide = this._proceedPool.bind(this);

        // We don't want interferences with the timer
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }

        notification.show();
        this.options._canAutoCloseNotification = false; // eslint-disable-line no-underscore-dangle

        if (notification.options.autoCloseTimer === -1 && notification.options.closeable) {
          this.timer = setTimeout(function () {
            this.options._canAutoCloseNotification = true; // eslint-disable-line no-underscore-dangle
            var poolSize = this.options.pool.length;
            if (poolSize > 1) notification.hide();
          }.bind(this), this.options.minimumDisplayTime * 1000);
        }
      }.bind(this));
    },

    /**
     * If the oldest notification in the pool has already been displayed, it is
     * removed and the next one is displayed
     */
    _proceedPool: function () {
      if (!this.options.pool.length) return;

      var notification = this.options.pool[0];

      if (!notification.options._visible) { // eslint-disable-line no-underscore-dangle
        notification.remove(); // We delete from the DOM (fire and forget)
        this.options.pool.shift();
        if (this.options.pool.length) this._displayNotification();
      }
    }

  });

  App.notifications = new App.View.NotificationsView();
})(this.App));
