import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'components';

const TableView = ({ meta, data, onClickAction }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <Table
        searchable
        columns={meta.columns || []}
        data={data}
        actions={meta.actions || []}
        onClickAction={onClickAction}
      />
    </div>
  </div>
);

TableView.propTypes = {
  meta: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default TableView;
