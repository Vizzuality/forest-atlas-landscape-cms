((function (App) {
  'use strict';

  App.View.NotificationModalView = Backbone.View.extend({
    className: 'c-notification-modal',
    template: HandlebarsTemplates['shared/notification-modal'],

    events: {
      'click .js-continue': '_onClickContinue'
    },

    defaults: {
      continueCallback: function () {}
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);

      this.render = this.render.bind(this);
    },

    /**
     * Event handler executed when the continue button is clicked
     * @param {Event} e - event
     */
    _onClickContinue: function (e) {
      e.preventDefault();
      this.options.continueCallback();
    },

    render: function () {
      this.el.innerHTML = this.template(this.options);

      return this;
    }
  });
})(this.App));
