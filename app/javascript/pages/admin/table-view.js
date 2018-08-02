import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'components';

const TableView = ({ meta, data }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        searchable
        columns={meta.columns || []}
        data={data}
        actions={meta.actions || []}
      />
    </div>
  </div>
);

TableView.propTypes = {
  meta: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default TableView;
