import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux';

import * as reducers from './reducers';

import Home from './containers/Home';
import Page from './containers/Page';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" preserveScrollTop={false} />
  </DockMonitor>
);

const middleware = routerMiddleware(browserHistory);
const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  DevTools.instrument(),
  compose(
    applyMiddleware(thunk),
    applyMiddleware(middleware)
  )
);

const history = syncHistoryWithStore(browserHistory, store);

export default function App() {
  return (
    <div>
      <Provider store={store}>
        <Router history={history}>
          <Route path={'/'} component={Home} />
          <Route path={'/page'} component={Page} />
        </Router>
      </Provider>
      <DevTools store={store} />
    </div>
  );
}
