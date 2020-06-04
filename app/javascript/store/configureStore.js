import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import {
  middleware as widgetEditorMiddleware,
  sagas as widgetEditorSagas,
} from '@widget-editor/widget-editor';

import rootReducer from 'reducers';

const composeEnhancers = composeWithDevTools({});

const createStoreWithMiddleware = composeEnhancers(
  applyMiddleware(
    thunk,
    widgetEditorMiddleware,
  )
)(createStore);

export default function configureStore(initialState = {}) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  widgetEditorMiddleware.run(widgetEditorSagas);
  return store;
}
