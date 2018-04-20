import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Table } from '../../shared';

const SiteListPages = ({ admin }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        columns={['Name', 'Description', 'chart type']}
        data={admin.widgets}
        actions={['edit', 'delete']}
      />
    </div>
  </div>
);

function mapStateToProps(state) {
  return { admin: state.admin };
}

SiteListPages.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(SiteListPages);
