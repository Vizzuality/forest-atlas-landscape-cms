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
      var dialogNotification = new App.View.NotificationView(App.Helper.Notifications.page.datasetRegistration);

      // Disable the register button and show a notification
      $('.js-register-dataset').on('click', function (e) {
        e.preventDefault();

        // Callback executed when the user clicks the continue button
        dialogNotification.options.continueCallback = function () {
          Turbolinks.visit(e.target.href);
        };

        // We show the dialog
        dialogNotification.show();
      });
    }

  });
})(this.App));
