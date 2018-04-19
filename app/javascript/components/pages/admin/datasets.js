import React from "react"
import PropTypes from "prop-types"

import { connect } from 'react-redux';

import { Table, DatasetModal } from '../../shared';

const Datasets = ({ admin }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        columns={['Title', 'Contexts', 'Connector', 'Function', 'Tags', 'Status']}
        data={admin.datasets}
        modal={DatasetModal}
        actions={['edit', 'info.metadata']}
      />
    </div>
  </div>
 );

function mapStateToProps(state) {
  return {
    admin: state.admin
  }
}

export default connect(mapStateToProps, null)(Datasets);
