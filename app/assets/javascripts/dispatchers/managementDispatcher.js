(function (App) {
  'use strict';

  var Dispatcher = Backbone.Router.extend({

    routes: {
      '(/)': 'Index',
      // Management
      'management/sites/:slug/site_pages(/)': 'Pages',
      'management/sites/:slug/site_pages/new(/)': 'PageCreation',
      'management/site_pages/:id/edit(/)': 'PageEdition',
      'management/sites/:slug/structure(/)': 'Structure',
      'management/sites/:slug/widgets(/)': 'Widgets',
      'management/sites/:slug/datasets(/)': 'Datasets',
      'management/sites/:slug/(datasets/:id/)dataset_steps/connector': 'ConnectorStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/position': 'PositionStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/open_content': 'OpenContentStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/open_content_preview': 'OpenContentPreviewStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/dataset': 'DatasetStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/filters': 'DatasetFiltersStep',
      'management/sites/:slug/(widgets/:id/)widget_steps/filters': 'WidgetFiltersStep',
      'management/sites/:slug/(widgets/:id/)widget_steps/visualization': 'VisualizationStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/preview': 'PreviewStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/map': 'MapStep',
      // Contexts
      'contexts': 'Contexts'
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
    Backbone.history.start({ pushState: true });
  };

  // We need for the DOM to be ready
  document.addEventListener('turbolinks:load', init);
}).call(this, this.App);
