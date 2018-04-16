// @flow
import * as actions from './public-site-actions';

const initialState = {
  current: null,
  page: null,
  settings: null,
  meta: {
    // Will be different, just setting up for now
    image: null,
    pageSize: null,
    siteTitleOnly: false
  }
}

export default (state=initialState, action) => {
  switch (action.type) {
  case actions.SET_SITE:
    return { ...state, current: action.current};
  case actions.SET_PAGE:
    return { ...state, page: action.page};
  case actions.SET_META:
    return { ...state, meta: action.meta};
  case actions.SET_SITE_SETTINGS:
    return { ...state, settings: action.settings };
  default:
    return state;
  }
}
