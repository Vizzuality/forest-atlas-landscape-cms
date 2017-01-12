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
      // Disable the register button and show a notification
      $('.js-register-dataset').on('click', function (e) {
        e.preventDefault();

        App.notifications.broadcast(Object.assign({},
          App.Helper.Notifications.page.datasetRegistration,
          {
            continueCallback: function () {
              Turbolinks.visit(e.target.href);
            }
          }
        ));
      });
    }

  });
})(this.App));
