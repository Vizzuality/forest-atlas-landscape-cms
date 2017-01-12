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

    /**
     * Render the vega charts
     */
    _renderCharts: function () {
      var chartsContainer = this.el.querySelectorAll('.js-chart');
      Array.prototype.slice.call(chartsContainer).forEach(function (chartContainer) {
        // TODO: get the data according to the id
        // var id = chartContainer.dataset.id;

        (new App.View.ChartWidgetView({
          el: chartContainer,
          /* eslint-disable */
          data: [ // TODO: use real data
            {"x": 1,  "y": 28}, {"x": 2,  "y": 55},
            {"x": 3,  "y": 43}, {"x": 4,  "y": 91},
            {"x": 5,  "y": 81}, {"x": 6,  "y": 53},
            {"x": 7,  "y": 19}, {"x": 8,  "y": 87},
            {"x": 9,  "y": 52}, {"x": 10, "y": 48},
            {"x": 11, "y": 24}, {"x": 12, "y": 49},
            {"x": 13, "y": 87}, {"x": 14, "y": 66},
            {"x": 15, "y": 17}, {"x": 16, "y": 27},
            {"x": 17, "y": 68}, {"x": 18, "y": 16},
            {"x": 19, "y": 49}, {"x": 20, "y": 15}
          ],
          /* eslint-enable */
          enableChartSelector: false
        })).render();
      });
    },

    render: function () {
      this.el.innerHTML = this.template();
      this.setElement(this.el);
      return this;
    },

    /**
     * Method executed when the modal has been inserted in the DOM
     */
    afterRender: function () {
      this._renderCharts();
    }
  });
})(this.App));
