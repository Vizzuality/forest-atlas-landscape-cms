import { combineReducers } from 'redux';

// Page reducers
import site from '../redactions/site';
import admin from '../redactions/admin';

const rootReducer = combineReducers({
  site,
  admin
});

export default rootReducer;
