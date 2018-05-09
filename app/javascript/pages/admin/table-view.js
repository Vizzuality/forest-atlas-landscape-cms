import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Table } from 'components';

const TableView = ({ admin }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        searchable
        columns={'columns' in admin.meta ? admin.meta.columns : []}
        data={'datapoint' in admin.meta ? admin[admin.meta.datapoint] : []}
        actions={'actions' in admin.meta ? admin.meta.actions : []}
      />
    </div>
  </div>
);

function mapStateToProps(state) {
  return { admin: state.admin };
}

TableView.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(TableView);
