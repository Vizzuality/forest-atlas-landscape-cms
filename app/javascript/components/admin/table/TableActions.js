import React from 'react';
import PropTypes from 'prop-types';

const TableActions = ({ data, actions, onClickAction }) => actions.map((action) => {
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

  if (action === 'delete') {
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

  return null;
});

TableActions.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired,
  onClickAction: PropTypes.func.isRequired
};

export default TableActions;
