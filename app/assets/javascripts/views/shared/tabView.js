
((function (App) {
  'use strict';

  App.View.TabView = Backbone.View.extend({

    // Don't set the "tagName" property here, see "_generateContainer"
    className: 'c-tabs',

    defaults: {
      // Array of objects containing the name of the tabs and the id of their associated content
      // Example: [ { name: "tab1", id: "content1" }, ... ]
      // Don't forget to add the role "tabpanel" on the matching id elements
      tabs: [],
      // Integer. First tab actived by default. This is an internal value.
      defaultTab: 0,
      // Integer. Index of the current selected tab.
      currentTab: 0,
      // String. CSS Class applied to the tab container. Only taken into account at instantiation.
      cssClass: null
    },

    events: {
      'click .tab': '_onChangeTab',
      'keydown': '_onKeydown'
    },

    template: HandlebarsTemplates['shared/tabs'],

    initialize: function (settings) {
      this.options = _.extend(this.defaults, settings);
      this._generateContainer();
    },

    /**
     * Update the el and $el elements of the instance in order to accept a
     * custom / modifier class (see the view's options)
     */
    _generateContainer: function () {
      var container = document.createElement('ul');
      container.classList.add(this.className);
      container.setAttribute('role', 'tablist');

      if (this.options.cssClass) {
        container.classList.add(this.options.cssClass);
      }

      this.setElement(container);
    },

    /**
     * Set global variables
     */
    _setVars: function () {
      this.$tabs = this.$el.find('.tab');
    },

    /**
     * Remove the "-current" class from the active tab
     */
    _cleanTabs: function () {
      this.$tabs
        .attr('tabindex', '-1')
        .attr('aria-selected', 'false');
    },

    /**
     * Save the current active tab and update the DOM to reflect the change
     */
    _setCurrentTab: function (index) {
      this.options.currentTab = index;
      this.$tabs.eq(index)
        .attr('tabindex', '0')
        .attr('aria-selected', 'true');
    },

    /**
     * Listener for the click event on the tabs
     * @param {Object} event
     */
    _onChangeTab: function (e) {
      if (!e) return;

      var $tab = $(e.currentTarget),
        tabIndex = this.$tabs.index($tab);

      // if the selected tab has been selected previously, do nothing
      if (this.options.currentTab === tabIndex) return;

      this._toggleTab(tabIndex);
    },

    /**
     * Change the active tab
     * @param {Number} index of the new active tab
     * @param {Boolean} if the tab needs to be focused on
     */
    _toggleTab: function (index, focus) {
      this.options.currentTab = index;
      this._cleanTabs();
      this._setCurrentTab(index);
      if (focus) this.$tabs.eq(index).focus();

      // Triggers a Backbone event with the name of the tab selected to
      // communicate other views that tab has been selected
      var tabName = this.options.tabs[index].name;
      App.Events.trigger('tab:selected', { tab: tabName });
    },

    /**
     * Listener for the key events on the container
     * @param {Object} event
     */
    _onKeydown: function (e) {
      switch (e.keyCode) {
        case 37: // left arrow
        case 38: // top arrow
          var previousTabIndex = (this.options.currentTab - 1) % this.options.tabs.length;
          if (previousTabIndex < 0) previousTabIndex = this.options.tabs.length - 1;
          this._toggleTab(previousTabIndex, true);
          break;

        case 39: // right arrow
        case 40: // down arrow
          var nextTabIndex = (this.options.currentTab + 1) % this.options.tabs.length;
          this._toggleTab(nextTabIndex, true);
          break;

        default:
      }
    },

    render: function () {
      var currentTabIndex = this.options.currentTab,
        tabs = this.options.tabs;

      if (tabs.length === 0) return this;

      this.$el.html(this.template({
        tabs: this.options.tabs
      }));

      this._setVars();
      this._setCurrentTab(currentTabIndex);

      return this;
    }

  });
})(this.App));
