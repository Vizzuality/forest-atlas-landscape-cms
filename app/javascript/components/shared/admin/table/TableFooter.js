import React from "react"
import PropTypes from "prop-types"

import classnames from 'classnames';

export default ({ pages, pagination, offsetPage, setRowsPerPage }) => {

  // Hide pagination if only 1 page
  if (pagination.pages === 0) {
    return null;
  }

  return (
    <div className="action-bar">
      <div className="rows-per-page">
        <label htmlFor="rows-per-page">Rows per page</label>
        <div className="c-select -mini">
          <select
            value={pagination.rowsPerPage}
            onChange={e => setRowsPerPage(e)}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="paginator">
        <button
          type="button"
          className={
            classnames({
              'c-button': true,
              '-mini': true,
              '-arrow-left': true,
              '-disabled': pagination.page === 1
            })
          }
          disabled={pagination.page === 1}
          onClick={() => offsetPage(pagination.page - 1)}>
          Previous page
        </button>

        {pagination.page} of {pagination.pages + 1}

        <button
          type="button"
          className={
            classnames({
              'c-button': true,
              '-mini': true,
              '-arrow-right': true,
              '-disabled': pagination.page === pagination.pages
            })
          }
          disabled={pagination.page === pagination.pages}
          onClick={() => offsetPage(pagination.page + 1)}>
          Next page
        </button>
      </div>
  </div>
  )
}
