((function (App) {
  'use strict';

  App.View.DescriptionDashboardModalView = Backbone.View.extend({

    className: 'c-description-dashboard-modal',
    template: HandlebarsTemplates['front/description-dashboard-modal'],

    defaults: {
      // Name of the page
      name: 'Dashboard',
      // Description of the dashboard
      description: '',
      // Callback to close the modal
      closeCallback: function () {}
    },

    events: {
      'click .js-close': '_onClickClose'
    },

    initialize: function (settings) {
      this.options = Object.assign({}, this.defaults, settings);
      this.render = this.render.bind(this);
    },

    _onClickClose: function () {
      this.options.closeCallback();
    },

    render: function () {
      this.el.innerHTML = this.template({
        title: this.options.name,
        description: this.options.description
      });
      this.setElement(this.el);
      return this;
    }

  });
})(this.App));
