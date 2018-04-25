import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';

function WidgetsPage(props) {
  return (
    <div className="l-page-list">
      <div className="wrapper">
        <Table
          columns={['Name', 'Description', 'chart type']}
          data={props.widgets}
          actions={['edit', 'delete']}
        />
      </div>
    </div>
  );
}

WidgetsPage.propTypes = {
  widgets: PropTypes.array.isRequired
};

export default WidgetsPage;
