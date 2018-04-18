import React from "react"
import PropTypes from "prop-types"

import { connect } from 'react-redux';

import { Table } from '../../shared';

const SiteListPages = ({ admin }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <div className="c-action-toolbar">
        <ul className="filters">
          <li>
              <div className="c-input-search">
                <input type="input" placeholder="Search (not implemented)" />
                <button>Search</button>
              </div>
          </li>
        </ul>
      </div>

      <Table
        columns={['Title', 'Url', 'Type']}
        data={admin.pages}
        actions={['toggle', 'edit', 'delete']}
      />

    </div>
  </div>
 );

function mapStateToProps(state) {
  return {
    admin: state.admin
  }
}

export default connect(mapStateToProps, null)(SiteListPages);
