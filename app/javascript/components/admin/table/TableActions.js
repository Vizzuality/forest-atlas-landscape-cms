import React from 'react';
import PropTypes from 'prop-types';

const TableActions = ({ data, action, onClickAction }) => {
  if (action === 'toggle' && 'enable' in data && 'enabled' in data && data.enable.value !== null) {
    return (
      <td key={action}>
        <span className="row-content">
          <button
            type="button"
            className={`c-table-action-button -${data.enabled.value ? 'disable' : 'enable'}`}
            title={data.enabled.value ? 'Disable' : 'Enable'}
            onClick={() => onClickAction(action, data)}
          >
            {data.enabled.value ? 'Disable' : 'Enable'}
          </button>
        </span>
      </td>);
  }

  if (action === 'edit') {
    return (
      <td key={action}>
        <span className="row-content">
          <button
            type="button"
            className="c-table-action-button -edit"
            title="Edit"
            onClick={() => onClickAction(action, data)}
          >
            Edit
          </button>
        </span>
      </td>);
  }

  if (action === 'delete' &&
  'delete' in data &&
  data.delete.value !== null) {
    return (
      <td key={action}>
        <span className="row-content">
          <button
            type="button"
            className="c-table-action-button -delete"
            title="Delete"
            onClick={() => onClickAction(action, data)}
          >
            Delete
          </button>
        </span>
      </td>);
  }

  if (action === 'info') {
    return (
      <td key={action}>
        <button
          type="button"
          className="c-table-action-button -info js-metadata-info"
          onClick={() => onClickAction(action, data)}
        >
          Info
        </button>
      </td>
    );
  }

  return <td key={action}>-</td>;
};

TableActions.propTypes = {
  data: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  onClickAction: PropTypes.func.isRequired
};

export default TableActions;
