import React from "react"
import PropTypes from "prop-types"
import Fuse from 'fuse.js';

import TableActions from './TableActions';
import Toolbar from './Toolbar';

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1
};

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      sort: 'asc',
      pagination: {
        limit: 10
      }
    }
    this.fuse = new Fuse(props.data, {
      keys: props.columns.map(col => col.toLowerCase() + '.value'), ...fuseOptions } );
  }

  onSearch(e) {
    this.setState({ q: e.target.value });
  }

  formatRow(d, k) {
    const { columns, actions } = this.props;
    return (
      <tr role="row" key={k}>
        {this.formatCols(d)}
        <TableActions actions={actions} data={d} />
      </tr>
    );
  }

  formatCols(d) {
    const { columns } = this.props;
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

  render() {
    const { data, columns, actions } = this.props;
    const { q, sort, pagination } = this.state;
    const { limit } = pagination;

    const filteredResults = q.length > 0 ? this.fuse.search(q) : data;

      return (<div className="c-table">
        <Toolbar q={q} onSearch={q => this.onSearch(q)} />
        <table role="grid">
          <thead>
          <tr className="header" role="row">
              {columns.map((col, k) => <th key={k}
                {...(k === 0 ?
                  { className: `-order-${sort === 'asc' ? 'ascending' : 'descending'}`} : {}
                )}
              role="columnheader">{col}</th>)}
              {/* Render empty rows for each action */}
              {actions.map((a, k) => <th key={k}  aria-sort="none" role="columnheader"></th>)}
          </tr>
          </thead>
          <tbody>
            {filteredResults &&
              filteredResults.map((d, k) => (k + 1) < limit ? this.formatRow(d, k) : 0)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
