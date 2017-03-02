((function (App) {
  'use strict';

  App.View.WidgetDeletionErrorModal = Backbone.View.extend({
    className: 'c-widget-deletion-modal',
    template: HandlebarsTemplates['management/widget-deletion-modal'],

    events: {
      'click .js-continue': '_onClickContinue'
    },

    options: {},

    initialize: function (settings) {
      this.options.errors = settings.errors.split(',');
      this.modal = new App.View.ModalView();
      this.modal.render = this.render.bind(this);
      this.modal.open();
    },

    /**
     * Event handler executed when the continue button is clicked
     * @param {Event} e - event
     */
    _onClickContinue: function (e) {
      e.preventDefault();
      this.modal.close();
      this.remove();
    },

    render: function () {
      this.el.innerHTML = this.template(this.options);

      return this;
    }
  });
})(this.App));
