import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import * as reducers from './reducers'

import Home from './views/Home';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" preserveScrollTop={false} />
  </DockMonitor>
)

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  DevTools.instrument(),
  compose(
    applyMiddleware(thunk)
  )
)

const history = syncHistoryWithStore(browserHistory, store)

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Router history={history}>
            <Route path='/' component={Home} />
          </Router>
        </Provider>
        <DevTools store={store} />
      </div>
    );
  }
};
