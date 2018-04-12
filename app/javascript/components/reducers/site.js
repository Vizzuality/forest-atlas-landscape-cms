import { SET_SITE, SET_PAGE, SET_META } from '../actions/site';

const initialState = {
  current: null,
  page: null,
  meta: {
    // Will be different, just setting up for now
    image: null,
    pageSize: null,
    siteTitleOnly: false
  }
}

export default (state=initialState, action) => {
  switch (action.type) {
  case SET_SITE:
    return { ...state, current: action.current};
  case SET_PAGE:
  return { ...state, page: action.page};
  case SET_META:
  return { ...state, meta: action.meta};
  default:
    return state;
  }
}
