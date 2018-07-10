import { connect } from 'react-redux';

import DashboardBookmarks from 'components/shared/DashboardBookmarks/dashboard-bookmarks.component';

import {
  getBookmarksFromStorage,
  createBookmark,
  deleteBookmark,
  updateBookmark,
  applyBookmark,
  setTooltipVisility
} from 'components/shared/DashboardBookmarks/dashboard-bookmarks.actions';

import { getBookmarks, getVisibilityTooltip } from 'components/shared/DashboardBookmarks/dashboard-bookmarks.selectors';
import { getPageSlug } from 'components/shared/Dashboard/dashboard.selectors';

const mapStateToProps = state => ({
  pageSlug: getPageSlug(state),
  bookmarks: getBookmarks(state),
  tooltipOpen: getVisibilityTooltip(state)
});

const mapDispatchToProps = dispatch => ({
  getBookmarks: () => dispatch(getBookmarksFromStorage()),
  createBookmark: () => dispatch(createBookmark()),
  deleteBookmark: bookmark => dispatch(deleteBookmark(bookmark)),
  updateBookmark: (bookmark, newBookmark) => dispatch(updateBookmark(bookmark, newBookmark)),
  applyBookmark: bookmark => dispatch(applyBookmark(bookmark)),
  setTooltipVisility: tooltipOpen => dispatch(setTooltipVisility(tooltipOpen))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardBookmarks);
