import { combineReducers } from 'redux';
import { reducers as widgetEditorReducers } from 'widget-editor';

// Page reducers
import site from 'redactions/site';
import admin from 'redactions/admin';
import env from 'redactions/env';

const rootReducer = combineReducers({
  site,
  admin,
  env,
  ...widgetEditorReducers
});

export default rootReducer;
