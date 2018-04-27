import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'components';

function WidgetsPage(props) {
  const rows = props.widgets.map(widget => ({
    id: { value: widget.id },
    name: { value: widget.name, sortable: true },
    description: { value: widget.description }
  }));

  return (
    <div className="l-page-list">
      <div className="wrapper">
        <Table
          name="List of widgets"
          searchable
          columns={['Name', 'Description']}
          data={rows}
          actions={['edit', 'delete']}
          onClickAction={(...params) => console.log(params)}
        />
      </div>
    </div>
  );
}

WidgetsPage.propTypes = {
  widgets: PropTypes.array.isRequired
};

export default WidgetsPage;
