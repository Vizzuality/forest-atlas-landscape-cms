import {
  ADD_BOOKMARK,
  DELETE_BOOKMARK,
  UPDATE_BOOKMARK,
  SET_BOOKMARKS,
  SET_TOOLTIP_VISIBILITY
} from 'components/public/DashboardBookmarks/dashboard-bookmarks.reducer';

import { getBookmarks } from 'components/public/DashboardBookmarks/dashboard-bookmarks.selectors';
import { getPageSlug } from 'components/public/Dashboard/dashboard.selectors';
import { getNonEmptyFilters, getFilters, getAvailableFields } from 'components/public/DashboardFilters/dashboard-filters.selectors';

import { resetFilters, addFilter, removeFilter } from 'components/public/DashboardFilters/dashboard-filters.actions';

/**
 * Retrieve the bookmarks from the localStorage
 * and set them in the store
 */
export const getBookmarksFromStorage = () => (
  (dispatch, getState) => {
    let bookmarks = [];
    const itemKey = `dashboard-bookmarks-${getPageSlug(getState())}`;

    try {
      bookmarks = JSON.parse(window.localStorage.getItem(itemKey)) || [];
    } catch (e) {
      console.error('Unable to retrieve the bookmarks from the localStorage', e);
    }

    dispatch({
      type: SET_BOOKMARKS,
      payload: bookmarks
    });
  }
);

/**
 * Save the bookmarks into the localStorage
 */
export const saveBookmarksToStorage = () => (
  (_, getState) => {
    const bookmarks = getBookmarks(getState())
      // We remove some attributes like "active"
      // and "editing"
      .map(bookmark => Object.assign({}, {
        name: bookmark.name,
        filters: bookmark.filters
      }));
    const itemKey = `dashboard-bookmarks-${getPageSlug(getState())}`;
    try {
      window.localStorage.setItem(itemKey, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Unable to save the bookmarks in the localStorage', e);
    }
  }
);

/**
 * Apply the filters of the bookmark
 * @param {{ name: string, filters: any[] }} bookmark Bookmark to apply
 */
export const applyBookmark = bookmark => (
  (dispatch, getState) => {
    // First, we remove all the filters
    dispatch(resetFilters());

    // Then, for each filter saved in the bookmark,
    // we check if the field still exists and is available
    bookmark.filters.forEach((filter) => {
      const fields = getAvailableFields(getState());
      if (fields.findIndex(f => f.name === filter.name) !== -1) {
        dispatch(addFilter(filter));
      }
    });

    // After resetting the filters, by default an empty one
    // has been added. Another has also been appended after the
    // last one.
    // We remove the very first one.
    const filters = getFilters(getState());
    if (bookmark.filters.length && filters.length && !filters[0].name) {
      dispatch(removeFilter(filters[0]));
    }
  }
);

/**
 * Create a new bookmark
 */
export const createBookmark = () => (
  (dispatch, getState) => {
    const bookmarksCount = getBookmarks(getState()).length;
    dispatch({
      type: ADD_BOOKMARK,
      payload: {
        name: `Bookmark #${bookmarksCount + 1}`,
        filters: getNonEmptyFilters(getState()).map(filter => (
          // We remove the min, max and possibleValues attributes
          // from the bookmark because the dataset can change
          // over time
          Object.assign({}, { name: filter.name, type: filter.type, values: filter.values })
        ))
      }
    });
    dispatch(saveBookmarksToStorage());
  }
);

/**
 * Delete a bookmark
 * @param {{ name: string, filters: any[] }} bookmark Bookmark to delete
 */
export const deleteBookmark = bookmark => (
  (dispatch) => {
    dispatch({
      type: DELETE_BOOKMARK,
      payload: bookmark
    });
    dispatch(saveBookmarksToStorage());
  }
);

/**
 * Update an existing bookmark
 * @param {{ name: string, filters: any[] }} bookmark Reference to the previous bookmark
 * @param {{ name: string, filters: any[] }} newBookmark Updated bookmark
 */
export const updateBookmark = (bookmark, newBookmark) => (
  (dispatch) => {
    dispatch({
      type: UPDATE_BOOKMARK,
      payload: { bookmark, newBookmark }
    });
    dispatch(saveBookmarksToStorage());
  }
);

/**
 * Set the visibility of the tooltip
 * @param {boolean} tooltipOpen Whether the tooltip is open
 */
export const setTooltipVisility = tooltipOpen => ({
  type: SET_TOOLTIP_VISIBILITY,
  payload: tooltipOpen
});
