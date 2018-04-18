import React from "react"
import PropTypes from "prop-types"

import TableActions from './TableActions';

function _formatCols(d, columns) {
  const re = new RegExp(columns.join('|').toLowerCase());
  return Object.keys(d).map(key => {
    if (re.test(key)) {
      if ('link' in d[key]) {
        return (
          <td key={key + d[key].value}>
            <span className="row-content">
              <a href={d[key].link.url}
                {...('external' in d[key].link && d[key].link.external ? {
                  'target': '__blank',
                  'rel': 'noopener noreferrer'
                } : {})}
              >{d[key].value}</a>
            </span>
          </td>
        )
      }
      return <td key={key + d[key].value}>{d[key].value}</td>
    }
    return null;
  });
}

function _formatRow(d, k, columns, actions) {
  return (
    <tr role="row" key={k}>
      {_formatCols(d, columns)}
      <TableActions actions={actions} data={d} />
    </tr>
  );
}

export default function Table({ columns = [], data = null, actions = [], limit=10 }) {
    return (<div className="c-table">
      <table role="grid">
        <thead>
        <tr className="header" role="row">
            {columns.map((col, k) => <th key={k} role="columnheader">{col}</th>)}
            {/* Render empty rows for each action */}
            {actions.map((a, k) => <th key={k}  aria-sort="none" role="columnheader"></th>)}
        </tr>
        </thead>
        <tbody>
          {data && data.map((d, k) => (k + 1) < limit ? _formatRow(d, k, columns, actions) : 0)}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

/*

<tr role="row" aria-rowindex="2">
    <td role="gridcell" aria-rowindex="2">
        <span class="row-name">title</span><span class="row-content"> <a href="http://localhost:3000/" target="_blank" rel="noopener">Homepage</a> </span>
    </td>
    <td role="gridcell" aria-rowindex="2">
        <span class="row-name">url</span><span class="row-content"> / </span>
    </td>
    <td role="gridcell" aria-rowindex="2">
        <span class="row-name">type</span><span class="row-content"> Homepage </span>
    </td>
    <td role="gridcell" aria-rowindex="">
            <span class="row-name"></span><span class="row-content"> – </span>
    </td>
    <td role="gridcell" aria-rowindex="2">
        <span class="row-name"></span><span class="row-content"> <a href="/management/sites/base-site/site_pages/16/page_steps/position/edit" class="c-table-action-button -edit" title="Edit">Edit</a> </span>
    </td>
    <td role="gridcell" aria-rowindex="">
            <span class="row-name"></span><span class="row-content"> – </span>
    </td>
</tr>

*/