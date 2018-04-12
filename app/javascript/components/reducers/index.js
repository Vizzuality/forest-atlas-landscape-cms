import { combineReducers } from 'redux';

// Page reducers
import site from '../pages/public-site/public-site-reducer';

const rootReducer = combineReducers({
  site
});

export default rootReducer;
