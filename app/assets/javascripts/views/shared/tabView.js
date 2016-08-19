
(function(App) {

  'use strict';

  App.View.TabView = Backbone.View.extend({

    className: 'c-tabs',

    defaults: {
      // String array with the name of the tabs to display.
      tabs: [],
      // Integer. First tab actived by default. This is an internal value.
      defaultTab: 0,
      // String. Name of the tab you want to select
      currentTab: null,
      // String. CSS Class applied to the tab container
      cssClass: null
    },

    events: {
      'click .tab': '_onChangeTab'
    },

    template: HandlebarsTemplates['shared/tabs'],

    initialize: function(settings) {
      this.options = _.extend(this.defaults, settings);

      if (!this.options.currentTab) {
        this.options.currentTab = this.options.defaultTab
      }
    },

    _setVars: function() {
      this.$tabs = this.$el.find('.tab');
    },

    _cleanTabs: function() {
      this.$tabs.removeClass('-current');
    },

    _setCurrentTab: function($tab) {
      if(!$tab) return;

      $tab.addClass('-current');
    },

    _onChangeTab: function(e) {
      if(!e) return;

      var $tab = $(e.currentTarget),
        tabName = $tab.data('tab');

      // if the selected tab has been selected previously, do nothing
      if ($tab.hasClass('-current')) return;

      this._cleanTabs();
      this._setCurrentTab($tab);

      // Triggers a Backbone event with the name of the tab selected to
      // comunicate other views that tab has been selected
      Backbone.Events.trigger('tab:selected', {tab: tabName});
    },

    render: function() {
      var currentTabIndex = this.options.currentTab,
        $tab;

      this.$el.html(this.template({
        cssClass: this.options.cssClass,
        tabs: this.options.tabs,
      }));

      this._setVars();

      // Selects indicated tab by the user or default one
      if (typeof currentTabIndex === 'string') {
        $tab = $('.tab[data-tab="' + currentTabIndex + '"]');
      } else {
        $tab = $(this.$tabs[currentTabIndex]);
      }

      this._setCurrentTab($tab);

      return this.$el;
    }

  });

})(this.App);
