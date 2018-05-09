import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Table } from 'components';

const SiteListPages = ({ admin }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        searchable
        columns={['Title', 'Url', 'Type']}
        data={admin.pages}
        actions={['toggle', 'edit', 'delete']}
      />
    </div>
  </div>
);

function mapStateToProps(state) {
  return { admin: state.admin };
}

SiteListPages.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(SiteListPages);
