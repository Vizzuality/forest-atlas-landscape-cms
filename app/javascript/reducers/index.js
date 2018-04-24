import { combineReducers } from 'redux';

// Page reducers
import site from 'redactions/site';
import dashboard from 'redactions/dashboard';
import admin from 'redactions/admin';
import env from 'redactions/env';

const rootReducer = combineReducers({
  site,
  dashboard,
  admin,
  env
});

export default rootReducer;
