((function (App) {
  'use strict';

  // Sample data used to have visual representation of each chart
  /* eslint-disable */
  var sampleData = [
    {"x": 5,  "y": 28, "date": "01/01/2000", "val": "low"},
    {"x": 4,  "y": 55, "date": "01/01/2001", "val": "high"},
    {"x": 3,  "y": 43, "date": "01/01/2002", "val": "average"},
    {"x": 4,  "y": 91, "date": "01/01/2003", "val": "high"},
    {"x": 5,  "y": 81, "date": "01/01/2004", "val": "average"},
    {"x": 6,  "y": 53, "date": "01/01/2005", "val": "low"},
    {"x": 7,  "y": 19, "date": "01/01/2006", "val": "high"},
    {"x": 8,  "y": 87, "date": "01/01/2007", "val": "average"},
    {"x": 9,  "y": 52, "date": "01/01/2008", "val": "average"},
    {"x": 5,  "y": 48, "date": "01/01/2009", "val": "high"},
    {"x": 10, "y": 24, "date": "01/01/2010", "val": "average"},
    {"x": 7,  "y": 49, "date": "01/01/2011", "val": "low"},
    {"x": 3,  "y": 87, "date": "01/01/2012", "val": "high"},
    {"x": 4,  "y": 66, "date": "01/01/2013", "val": "average"},
    {"x": 5,  "y": 17, "date": "01/01/2014", "val": "high"},
    {"x": 6,  "y": 27, "date": "01/01/2015", "val": "average"},
    {"x": 7,  "y": 68, "date": "01/01/2016", "val": "low"},
    {"x": 8,  "y": 16, "date": "01/01/2017", "val": "high"},
    {"x": 9,  "y": 49, "date": "01/01/2018", "val": "average"},
    {"x": 0,  "y": 15, "date": "01/01/2019", "val": "average"}
  ];
  /* eslint-enable */

  App.View.WidgetsModalView = Backbone.View.extend({
    className: 'c-widgets-modal',
    template: HandlebarsTemplates['management/widgets-modal'],

    defaults: {
      // Callback executed when the user clicks the cancel button
      cancelCallback: function () {},
      // Callback executed when the user clicks the continue button
      // Takes as parameter the id of the selected widget
      continueCallback: function () {},
      // List of available widgets
      // Structure of a widget:
      // {
      //   id: 3,
      //   name: "My widget,
      //   description: "This is a widget about...",
      //   visualization: "{\"type\": \"pie\"}"
      // }
      widgets: []
    },

    events: {
      'click .js-cancel': '_onClickCancel',
      'click .js-continue': '_onClickContinue',
      'input .js-search-input': '_onInputSearchInput'
    },

    initialize: function (settings) {
      this.options = $.extend(true, {}, this.defaults, settings);
      this._initSearch();
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
     * Event handler executed when the user types in the search input
     * @param {Event} e - event
     */
    _onInputSearchInput: _.throttle(function (e) {
      var keyword = e.target.value;
      var widgets = !keyword.length ? this.options.widgets : this._search(keyword);

      // Once we get the list of widgets, we don't want to rerender the full
      // view because otherwise we'll lose the focus on the search field
      // The solution is to render the view but to keep the result in a variable
      // so we can just update the list of widgets

      // We render the full view into a variable
      var view = document.createElement('div');
      var html = this.template({
        widgets: widgets
      });
      view.innerHTML = html;

      // We get the DOM element corresponding to the widgets list container
      var widgetsList = view.querySelector('.js-widgets-list');

      // We create a fragment to avoid appending each widget to the DOM
      // Instead, we append them to the fragment and append it once to the
      // DOM
      var fragment = document.createDocumentFragment();
      for (var i = 0, j = widgetsList.children.length; i < j; i++) {
        fragment.appendChild(widgetsList.children[0]);
      }

      // We finally append the fragment to the DOM and render the charts
      this.el.querySelector('.js-widgets-list').innerHTML = '';
      this.el.querySelector('.js-widgets-list').appendChild(fragment);
      this._renderCharts();
    }, 300),

    /**
     * Init Fuse
     */
    _initSearch: function () {
      this.fuse = new Fuse(this.options.widgets, {
        keys: ['name', 'description'],
        tokenize: true,
        threshold: 0,
        shouldSort: false
      });
    },

    /**
     * Search for a keyword and filter the widgets list
     * NOTE: Only the name and description of the widgets will be searched
     * @param {string} keyword
     * @returns {object[]} filteredWidgets
     */
    _search: function (keyword) {
      return this.fuse.search(keyword);
    },

    /**
     * Return the widgets list
     * NOTE: this is needed to properly parse the visualization attribute
     * @returns {object[]}
     */
    _getWidgetsList: function () {
      return this.options.widgets
        .map(function (widget) {
          try {
            return {
              id: widget.id,
              name: widget.name,
              description: widget.description,
              type: JSON.parse(widget.visualization).type
            };
          } catch (e) {
            return null;
          }
        }).filter(function (widget) {
          return !!widget;
        });
    },

    /**
     * Render the vega charts
     */
    _renderCharts: function () {
      var chartsContainer = this.el.querySelectorAll('.js-chart');
      Array.prototype.slice.call(chartsContainer).forEach(function (chartContainer) {
        var chartType = chartContainer.dataset.type;

        (new App.View.ChartWidgetView({
          el: chartContainer,
          data: sampleData,
          enableChartSelector: false,
          chart: chartType,
          chartRatio: 0.61 // This should be updated whenever the size changes
        })).render();
      });
    },

    render: function () {
      this.el.innerHTML = this.template({
        widgets: this._getWidgetsList()
      });
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
