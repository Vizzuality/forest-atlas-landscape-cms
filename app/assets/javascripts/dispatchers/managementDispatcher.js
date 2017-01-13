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
      'sites/:slug/datasets(/)': 'Datasets',
      'sites/:slug/(datasets/:id/)dataset_steps/connector': 'ConnectorStep',
      'sites/:slug/(site_pages/:id/)page_steps/position': 'PositionStep',
      'sites/:slug/(site_pages/:id/)page_steps/open_content': 'OpenContentStep',
      'sites/:slug/(site_pages/:id/)page_steps/open_content_preview': 'OpenContentPreviewStep',
      'sites/:slug/(site_pages/:id/)page_steps/dataset': 'DatasetStep',
      'sites/:slug/(site_pages/:id/)page_steps/filters': 'DatasetFiltersStep',
      'sites/:slug/(site_pages/:id/)widget_steps/filters': 'WidgetFiltersStep',
      'sites/:slug/(site_pages/:id/)widget_steps/visualization': 'VisualizationStep',
      'sites/:slug/(site_pages/:id/)page_steps/preview': 'PreviewStep'
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
