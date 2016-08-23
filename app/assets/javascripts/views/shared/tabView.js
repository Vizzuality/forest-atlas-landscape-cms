
((function (App) {
  'use strict';

  App.View.TabView = Backbone.View.extend({

    // Don't set the "tagName" property here, see "_generateContainer"
    className: 'c-tabs',

    defaults: {
      // String array with the name of the tabs to display.
      tabs: [],
      // Integer. First tab actived by default. This is an internal value.
      defaultTab: 0,
      // Integer. Index of the current selected tab.
      currentTab: 0,
      // String. CSS Class applied to the tab container. Only taken into account at instantiation.
      cssClass: null
    },

    events: {
      'click .tab': '_onChangeTab'
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
      container.classList.add('c-tabs');

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
      this.$tabs.removeClass('-current');
    },

    /**
     * Save the current active tab and update the DOM to reflect the change
     */
    _setCurrentTab: function (index) {
      this.options.currentTab = index;
      this.$tabs.eq(index).addClass('-current');
    },

    _onChangeTab: function (e) {
      if (!e) return;

      var $tab = $(e.currentTarget),
        tabIndex = this.$tabs.index($tab),
        tabName = this.options.tabs[tabIndex];

      // if the selected tab has been selected previously, do nothing
      if (this.options.currentTab === tabIndex) return;

      this._cleanTabs();
      this._setCurrentTab(tabIndex);

      // Triggers a Backbone event with the name of the tab selected to
      // communicate other views that tab has been selected
      Backbone.Events.trigger('tab:selected', { tab: tabName });
    },

    render: function () {
      var currentTabIndex = this.options.currentTab,
        tabs = this.options.tabs;

      if (tabs.length === 0) return this;

      this.$el.html(this.template({
        cssClass: this.options.cssClass,
        tabs: this.options.tabs
      }));

      this._setVars();
      this._setCurrentTab(currentTabIndex);

      return this;
    }

  });
})(this.App));
