((function (App) {
  'use strict';

  App.Router.ManagementProfile = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    index: function () {
      document.querySelector('.js-form').addEventListener('submit', function (e) {
        var checkbox = document.querySelector('.js-remove-checkbox');
        if (!checkbox.checked) return;

        e.preventDefault();

        var params = App.Helper.Notifications.profile.deletion;
        params.continueCallback = function () {
          this.submit();
        }.bind(this);

        App.notifications.broadcast(params);
      });
    }

  });
})(this.App));
