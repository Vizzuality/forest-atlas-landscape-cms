import React from "react"
import PropTypes from "prop-types"

// Any action we accept for the table, add it here, otherwise it will be ignored
export default ({data, actions}) => {
  return actions.map((action, k) => {

    if (action === 'toggle' &&
        'enable' in data &&
        'enabled' in data &&
        data.enable.value !== null) {

      return (<td key={k}>
          <span className="row-content">
            <a href="/management/sites/base-site/site_pages/17/toggle_enable"
                className={`c-table-action-button -${data.enabled.value ? 'disable' : 'enable'}`}
                title={data.enabled.value ? 'Disable' : 'Enable'}
                rel="noreferrer noopener"
                data-method="put">{data.enabled.value ? 'Disable' : 'Enable'}</a>
          </span>
      </td>)
    }

    if (action === 'edit' && 'edit' in data) {
      return (<td key={k}>
        <span className="row-content">
          <a href={data.edit.value}
             className="c-table-action-button -edit"
             title="Edit">Edit</a>
        </span>
      </td>)
    }


    if (action === 'delete' &&
        'delete' in data &&
        data.delete.value !== null) {
      return (<td key={k}>
        <span className="row-content">
          <a href={data.delete.value}
             className="c-table-action-button -delete js-confirm"
             title="Delete"
             rel="nofollow"
             data-method="delete">Delete</a>
        </span>
      </td>)
    }

    return <td key={k}>-</td>;
  });
}
