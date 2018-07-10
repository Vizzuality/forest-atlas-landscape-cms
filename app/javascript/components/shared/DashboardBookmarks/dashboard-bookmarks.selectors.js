import { createSelector } from 'reselect';

const getBookmarksSelector = state => state.dashboardBookmarks.bookmarks;
const getTooltipVisibilitySelector = state => state.dashboardBookmarks.tooltipOpen;

export const getBookmarks = createSelector(
  [getBookmarksSelector],
  bookmarks => bookmarks
);

export const getVisibilityTooltip = createSelector(
  [getTooltipVisibilitySelector],
  tooltipOpen => tooltipOpen
);
