import React from "react"
import PropTypes from "prop-types"

export default ({ q, onSearch }) => {
  return (<div className="c-action-toolbar">
  <ul className="filters">
    <li>
        <div className="c-input-search">
          <input type="input" placeholder="Search" onKeyUp={e => onSearch(e)}  />
          <button>Search</button>
        </div>
    </li>
  </ul>
  </div>);
}
