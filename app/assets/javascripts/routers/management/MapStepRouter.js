((function (App) {
  'use strict';

  App.Router.ManagementMapStep = Backbone.Router.extend({

    routes: {
      '(/)': 'index'
    },

    initialize: function (params) {
      this.slug = params[0] || null;
    },

    index: function () {
      var editor = document.querySelector('.js-editor');
      CodeMirror.fromTextArea(editor, { mode: 'javascript', json: true });
    }

  });
})(this.App));
