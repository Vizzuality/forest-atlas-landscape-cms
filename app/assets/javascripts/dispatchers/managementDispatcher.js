(function (App) {
  const Dispatcher = Backbone.Router.extend({

    routes: {
      'management/sites/:slug/structure(/)': 'Structure',
      'management/sites/:slug/(datasets/:id/)dataset_steps/connector': 'ConnectorStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/position': 'PositionStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/tag_searching': 'TagSearchingStep',
      'management/sites/:slug/(site_pages/:id/)page_steps/map': 'MapStep',
      'management/profile/:id/edit': 'Profile',
      'management/sites/:slug/contexts(/)': 'Contexts',
      contexts: 'Contexts',
    }
  });

  const init = function () {
    const dispatcher = new Dispatcher();

    dispatcher.on('route', (routeName, params) => {
      Backbone.history.stop();
      const Router = App.Router[`Management${routeName}`];

      if (Router) {
        // The try catch statement is used to ensure we always
        // load the Quick links component
        try {
          new Router(params.slice(0, params.length - 1));
          Backbone.history.start({ pushState: false });
        } catch (e) {
          // Better message to find the error
          // eslint-disable-next-line no-console
          console.error(`File: ${e.fileName}\nLine: ${e.lineNumber}\nMessage: ${e.message}`);
        }
      }
    });

    // Because turbolinks doesn't fully reload the page, we need to stop the
    // history before anything else
    Backbone.history.stop();

    // We need this to detect router pathname
    Backbone.history.start({ pushState: true });

    // We instantiate the User links component
    new App.View.UserLinksView();

    // We instantiate the Quick links component
    const quickLinksParams = {};

    if (/^\/contexts?/.test(location.pathname)) {
      quickLinksParams.activeLink = 'contexts';
    } else if (/management\/profile/.test(location.pathname)) {
      quickLinksParams.activeLink = 'management';
    } else {
      const match = location.pathname.match(/management\/sites\/(([A-z]|-)+)/);
      if (match && match.length > 1) {
        quickLinksParams.activeLink = match[1];
      } else {
        quickLinksParams.activeLink = 'management';
      }
    }

    new App.View.QuickLinksView(quickLinksParams);
  };

  // We need for the DOM to be ready
  window.addEventListener('DOMContentLoaded', init);
}).call(this, this.App);
