(function (App) {
  'use strict';

  var Dispatcher = Backbone.Router.extend({

    routes: {
      '(/)': 'Index',
      'sites/:slug/site_pages(/)': 'Pages',
      'sites/:slug/site_pages/new(/)': 'PageCreation',
      'site_pages/:id/edit(/)': 'PageEdition',
      'sites/:slug/structure(/)': 'Structure',
      'sites/:slug/widgets(/)': 'Widgets',
      'sites/:slug/page_steps/dataset': 'DatasetStep',
      'sites/:slug/page_steps/filters': 'FiltersStep'
    }
  });

  var init = function () {
    var dispatcher = new Dispatcher();

    dispatcher.on('route', function (routeName, params) {
      Backbone.history.stop();
      var Router = App.Router['Management' + routeName];

      if (Router) {
        new Router(params.slice(0, params.length - 1));

        Backbone.history.start({ pushState: false });
      }
    });

    // Because turbolinks doesn't fully reload the page, we need to stop the
    // history before anything else
    Backbone.history.stop();

    // We need this to detect router pathname
    Backbone.history.start({ pushState: true, root: '/management' });
  };

  // We need for the DOM to be ready
  document.addEventListener('turbolinks:load', init);
}).call(this, this.App);
