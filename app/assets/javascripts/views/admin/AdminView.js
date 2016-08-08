
(function(App) {

  'use strict';

  App.View.AdminView = Backbone.View.extend({

    defaults: {
      tab: 'sites'
    },

    el: '.l-admin',

    events: {
      'click .tab' : '_changeTab'
    },

    initialize: function() {
      this._setVars();

      this._renderTabContent();
    },

    _setVars: function() {
      // DOM
      this.$tabContent = $('#tab-content');

      // view vars
      this.currentTab = this.defaults.tab;
    },

    _changeTab: function(e) {
      if (!e) return;

      var tab = $(e.currentTarget).data('type');

      if (tab == this.currentTab) return;

      this.currentTab = tab;

      this._renderTabContent();
    },

    _selectTab: function() {
      $('.tab').removeClass('-active');
      var $activeTab = $('.tab[data-type="' + this.currentTab + '"]');

      $activeTab.addClass('-active');
    },

    _renderTabContent: function() {
      this._selectTab();

      if (this.currentTab == 'sites') {

        this.headers = [{
          field_name: 'name',
          searchable: true
        }, {
          field_name: 'user',
          searchable: false
        }, {
          field_name: 'date',
          searchable: false
        }];

        this.tableOptions = {
          filters: {
            search: true,
            sortBy: true
          },
          headers: this.headers,
          tab: this.currentTab
        };
      }

      if (this.currentTab == 'users') {
        this.headers = [{
          field_name: 'name',
          searchable: true
        }, {
          field_name: 'sites',
          searchable: false
        }];

        this.tableOptions = {
          filters: {
            search: true,
            sortBy: true
          },
          headers: this.headers,
          tab: this.currentTab
        };
      }

      this.render();
    },

    render: function() {
      new App.View.TableView(this.tableOptions);
    }

  });


})(this.App);
