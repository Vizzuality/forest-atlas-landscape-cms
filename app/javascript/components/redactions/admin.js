const initialState = {
  pages: null
}

export const SET_ADMIN_PAGES = '@admin/SET_PAGES';

export function setPages(pages) {
  return {
    type: SET_ADMIN_PAGES,
    pages
  };
}

export default (state=initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_PAGES:
    return { ...state, pages: action.pages};
  default:
    return state;
  }
}
