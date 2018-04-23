import { combineReducers } from 'redux';

// Page reducers
import site from '../redactions/site';
import admin from '../redactions/admin';
import env from '../redactions/env';

const rootReducer = combineReducers({
  site,
  admin,
  env
});

export default rootReducer;
