((function (App) {
  'use strict';

  App.View.HomeView = Backbone.View.extend({

    initialize: function () {
      // Uncomment this code block to test tabs
      // var tabs = new App.View.TabView({
      //   tabs: [
      //     { name: 'tab1', id: 'tab1' },
      //     { name: 'tab2', id: 'tab2' },
      //     { name: 'tab3', id: 'tab3' }
      //   ],
      //   cssClass: '-red'
      // }).render().el;

      // $('body').append(tabs);
      // $('body').append('<div id="tab1" role="tabpanel">Content for tab 1</div>' +
      //   '<div id="tab2" role="tabpanel">Content for tab 2</div>' +
      //   '<div id="tab3" role="tabpanel">Content for tab 3</div>');
    }

  });

  new App.View.HomeView();
})(this.App));
