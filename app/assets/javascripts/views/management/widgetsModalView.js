((function (App) {
  'use strict';

  App.View.WidgetsModalView = Backbone.View.extend({
    className: 'c-widgets-modal',
    template: HandlebarsTemplates['management/widgets-modal'],

    defaults: {
      // Callback executed when the user clicks the cancel button
      cancelCallback: function () {},
      // Callback executed when the user clicks the continue button
      // Takes as parameter the id of the selected widget
      continueCallback: function () {}
    },

    events: {
      'click .js-cancel': '_onClickCancel',
      'click .js-continue': '_onClickContinue'
    },

    initialize: function (settings) {
      this.options = $.extend(true, {}, this.defaults, settings);
      this.render = this.render.bind(this);
    },

    /**
     * Event handler executed when the cancel button is clicked
     */
    _onClickCancel: function () {
      this.options.cancelCallback();
    },

    /**
     * Event handler executed when the continue button is clicked
     * @param {Event} e - event
     */
    _onClickContinue: function (e) {
      e.preventDefault();

      var widget = this.el.querySelector('input:checked');
      if (!widget) return;

      this.options.continueCallback(widget.value);
    },

    render: function () {
      this.el.innerHTML = this.template();
      this.setElement(this.el);
      return this;
    }
  });
})(this.App));
