import { routerMiddleware, push } from 'react-router-redux';
import { NAV_PUSH, NAV_POP } from '../actions/navigation';

const initialNavState = {
  page: ''
};

function navigationState(state = initialNavState, action) {
  switch (action.type) {
    case NAV_PUSH:
      return push('/page');
    case NAV_POP:
      return '';
    default:
      return state;
  }
}

export default navigationState;
