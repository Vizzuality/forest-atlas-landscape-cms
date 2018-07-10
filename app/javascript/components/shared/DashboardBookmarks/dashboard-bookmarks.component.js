import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class DashboardBookmarks extends React.Component {
  componentWillMount() {
    if (this.props.pageSlug) {
      this.props.getBookmarks();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageSlug && nextProps.pageSlug !== this.props.pageSlug) {
      this.props.getBookmarks();
    }
  }

  /**
   * Event handler executed when the user types the new
   * name of a bookmark
   * @param {{ name: string, filters: any[], editing: boolean }} bookmark Bookmark to update
   * @param {Event} e Event
   */
  onKeydownName(bookmark, e) {
    if (e.keyCode === 13) { // Enter key
      this.onBlurName(bookmark, e);
    }
  }

  /**
   * Event handler executed when the user removes the focus
   * from the element where he was changing the name of a bookmark
   * @param {{ name: string, filters: any[], editing: boolean }} bookmark Bookmark to update
   * @param {Event} e Event
   */
  onBlurName(bookmark, { currentTarget }) {
    const newBookmarkName = currentTarget.textContent;
    this.props.updateBookmark(bookmark, Object.assign({}, bookmark, {
      name: newBookmarkName.length
        ? newBookmarkName
        : bookmark.name,
      editing: false,
      active: false
    }));
  }

  render() {
    return (
      <div className="c-dashboard-bookmarks">
        <div className="bookmarks-wrapper">
          <div className="info">
            Bookmarks:
            <div className="tooltip-container">
              <button
                type="button"
                onMouseOver={() => this.props.setTooltipVisility(true)}
                onMouseOut={() => this.props.setTooltipVisility(false)}
                onClick={() => this.props.setTooltipVisility(!this.props.tooltipOpen)}
              >
                Info
              </button>
              { this.props.tooltipOpen && (
                <div className="tooltip">
                  By adding a new bookmark, you can save the state of the filters of this dashboard.
                </div>
              )}
            </div>
          </div>
          { !!this.props.bookmarks.length && (
            <ul className="bookmarks">
              { this.props.bookmarks.map(bookmark => (
                <li
                  key={bookmark.name}
                  tabIndex="0"
                  onFocus={() => !bookmark.editing && this.props.updateBookmark(
                    bookmark,
                    Object.assign({}, bookmark, { active: true })
                  )}
                  onBlur={() => !bookmark.editing && this.props.updateBookmark(
                    bookmark,
                    Object.assign({}, bookmark, { active: false })
                  )}
                  className={classnames({
                    '-active': !bookmark.editing && bookmark.active,
                    '-no-active': bookmark.editing
                  })}
                >
                  <span
                    {...(bookmark.editing ? { contentEditable: true } : {})}
                    onBlur={e => this.onBlurName(bookmark, e)}
                    onKeyDown={e => this.onKeydownName(bookmark, e)}
                  >
                    {bookmark.name}
                  </span>
                  <div>
                    <button type="button" className="apply" title="Apply bookmark" aria-label="Apply bookmark" onClick={() => this.props.applyBookmark(bookmark)}>
                      {bookmark.name}
                    </button>
                    <div className="floating-buttons">
                      <button
                        type="button"
                        className="-edit"
                        title="Edit bookmark name"
                        onClick={() => this.props.updateBookmark(bookmark, Object.assign({}, bookmark, { editing: true, active: true }))}
                      >
                        Edit bookmark name
                        <svg width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M11.279 0l3.711 3.711-9.278 9.278-3.711-3.71L11.279 0zM1.537 9.742l3.711 3.711-4.392.682.681-4.393z" fill="#FFF" fillRule="evenodd" /></svg>
                      </button>
                      <button type="button" className="-delete" title="Delete bookmark" onClick={() => this.props.deleteBookmark(bookmark)}>
                        Delete bookmark
                        <svg width="10" height="14" viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg"><path d="M7 1V0H3v1H0v2h10V1H7zM1 14h8V4H1v10z" fill="#555" fillRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="add-button">
            <button type="button" onClick={this.props.createBookmark}>Bookmark filters</button>
          </div>
        </div>
      </div>
    );
  }
}

DashboardBookmarks.propTypes = {
  pageSlug: PropTypes.string,
  getBookmarks: PropTypes.func.isRequired,
  bookmarks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    filters: PropTypes.array
  })).isRequired,
  tooltipOpen: PropTypes.bool.isRequired,
  createBookmark: PropTypes.func.isRequired,
  deleteBookmark: PropTypes.func.isRequired,
  updateBookmark: PropTypes.func.isRequired,
  applyBookmark: PropTypes.func.isRequired,
  setTooltipVisility: PropTypes.func.isRequired
};

DashboardBookmarks.defaultProps = {
  pageSlug: null
};

export default DashboardBookmarks;
