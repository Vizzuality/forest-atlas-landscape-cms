export const SET_BOOKMARKS = 'DASHBOARD_BOOKMARKS/SET_BOOKMARKS';
export const ADD_BOOKMARK = 'DASHBOARD_BOOKMARKS/ADD_BOOKMARK';
export const DELETE_BOOKMARK = 'DASHBOARD_BOOKMARKS/DELETE_BOOKMARK';
export const UPDATE_BOOKMARK = 'DASHBOARD_BOOKMARKS/UPDATE_BOOKMARK';
export const SET_TOOLTIP_VISIBILITY = 'DASHBOARD_BOOKMARKS/SET_TOOLTIP_VISIBILITY';

const initialState = {
  bookmarks: [],
  tooltipOpen: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOOKMARK:
      return Object.assign({}, state, { bookmarks: [...state.bookmarks, action.payload] });

    case DELETE_BOOKMARK: {
      const index = state.bookmarks.findIndex(b => b.name === action.payload.name);
      if (index !== -1) {
        const bookmarks = [...state.bookmarks];
        bookmarks.splice(index, 1);
        return Object.assign({}, state, { bookmarks });
      }
      return state;
    }

    case UPDATE_BOOKMARK: {
      const index = state.bookmarks.findIndex(b => b.name === action.payload.bookmark.name);
      if (index !== -1) {
        const bookmarks = [...state.bookmarks];
        bookmarks.splice(index, 1, action.payload.newBookmark);
        return Object.assign({}, state, { bookmarks });
      }
      return state;
    }

    case SET_BOOKMARKS:
      return Object.assign({}, state, { bookmarks: action.payload });

    case SET_TOOLTIP_VISIBILITY:
      return Object.assign({}, state, { tooltipOpen: action.payload });

    default:
      return state;
  }
};
