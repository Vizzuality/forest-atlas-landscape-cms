((function (App) {
  'use strict';

  App.Router.ManagementDatasetStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      var notAvailableNotification = new App.View.NotificationView({
        autoCloseTimer: 5,
        type: 'warning',
        content: 'This feature isn\'t available yet.'
      });

      // Disable the register button and show a notification
      $('.js-register-dataset').on('click', function (e) {
        e.preventDefault();
        notAvailableNotification.show();
      });
    }

  });
})(this.App));
