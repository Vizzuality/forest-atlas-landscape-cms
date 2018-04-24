import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import rootReducer from 'reducers';

const composeEnhancers = composeWithDevTools({});

const createStoreWithMiddleware = composeEnhancers(applyMiddleware(
  thunk
))(createStore);

export default function configureStore(initialState={}) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
