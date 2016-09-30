((function (App) {
    'use strict';

    App.Router.AdminSettings = Backbone.Router.extend({

        routes: {
            '(/)': 'index',
        },
        index: function () {
            // We remove the site switcher container
            new App.View.Settings({});
        }

    });
})(this.App));
