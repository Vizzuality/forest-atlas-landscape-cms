import React from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import classnames from 'classnames';

import TableActions from 'components/table/TableActions';
import Toolbar from 'components/table/Toolbar';
import TableFooter from 'components/table/TableFooter';

import { Modal } from 'components';

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

    const cols = props.columns || Object.keys(props.data[0]);

    this.state = {
      q: '',
      sort: 'asc',
      modalOpen: false,
      datasetInfo: null,
      columns: cols,
      // when / if we get dynamic pagination, use that information instead
      pagination: {
        limit: props.limit || 10,
        page: 1,
        offset: 0,
        pages: parseInt(props.data.length / (props.limit || 10))
      }
    };

    this.fuse = new Fuse(props.data, { keys: cols.map(col => `${col.toLowerCase()}.value`), ...fuseOptions });
  }

  onSearch(e) {
    this.setState({ q: e.target.value });
  }


  onCloseModal() {
    this.setState({ modalOpen: false, datasetInfo: null });
  }

  setRowsPerPage(e) {
    const pagination = { ...this.state.pagination, limit: parseInt(e.target.value) };
    this.setState({ pagination })
  }

  offsetPage(p) {
    const { offset, limit, page } = this.state.pagination;

    const newOffset = p > page ? offset + limit : offset - limit;
    const pagination = { ...this.state.pagination, page: p, offset: newOffset };

    this.setState({ pagination });
  }

  showRowInfo(data) {
    this.setState({ modalOpen: true, datasetInfo: data });
  }

  formatRow(d, k) {
    const { actions } = this.props;
    return (
      <tr role="row" key={k}>
        {this.formatCols(d)}
        {actions && <TableActions actions={actions} data={d} showRowInfo={i => this.showRowInfo(i)} />}
      </tr>
    );
  }

  // verify pagination, if we should render item
  verifyPagination(k) {
    const { pagination } = this.state;
    const { limit, offset } = pagination;

    const shouldShow = k < (limit + offset) && k >= offset;

    return shouldShow;
  }

  formatCols(d) {
    const { columns } = this.state;
    const re = new RegExp(columns.join('|').toLowerCase());

    return Object.keys(d).map((key) => {

      const value = d[key].value && d[key].value.length > 0 ? d[key].value : '-';
      const cls = classnames({
        isLong: value.length > 15,
        isList: Array.isArray(value)
      });

      if (re.test(key)) {
        if (typeof d[key] !== 'object') {
          return (
            <td key={key + d[key]} className={cls}>
              <span className="row-content">
                {d[key]}
              </span>
            </td>);
        }

        if ('link' in d[key]) {
          return (
            <td key={key + value} className={cls}>
              <span className="row-content">
                <a
                  href={d[key].link.url}
                  {...('external' in d[key].link && d[key].link.external ? {
                    target: '__blank',
                    rel: 'noopener noreferrer'
                  } : {})}
                >{value}
                </a>
              </span>
            </td>
          );
        }
        return (
          <td key={key + value} className={cls}>
            <span className="row-content">
              {Array.isArray(value) ? value.join(' ') : value}
            </span>
          </td>);
      }
      return null;
    });
  }

  render() {
    const { data, actions, modal, searchable } = this.props;
    const { q, sort, columns, pagination, modalOpen, datasetInfo } = this.state;

    const filteredResults = (q.length > 0 && searchable) ? this.fuse.search(q) : data;

    return (
      <div className="c-table">
        {searchable && <Toolbar q={q} onSearch={query => this.onSearch(query)} />}
        <table role="grid">
          <thead>
            {filteredResults.length > 0 &&
            <tr className="header" role="row">
                {columns.map((col, k) => (
                  <th
                    key={k}
                    {...(k === 0 ?
                    { className: `-order-${sort === 'asc' ? 'ascending' : 'descending'}` } : {}
                    )}
                    role="columnheader"
                  >{col}
                  </th>))}
                {/* Render empty rows for each action */}
                {actions && actions.map((a, k) => (<th key={k} aria-sort="none" role="columnheader" />))}
            </tr>
            }
          </thead>
          <tbody>
            {filteredResults &&
              filteredResults.map((d, k) => (this.verifyPagination(k) ? this.formatRow(d, k) : null))}

            {filteredResults.length === 0 &&
            <tr role="row">
              {q.length > 0 ? <td align="center">No results found for {q}</td> :
              <td align="center">No items to display</td>}
            </tr>}

          </tbody>
        </table>

        <TableFooter
          pagination={pagination}
          offsetPage={p => this.offsetPage(p)}
          setRowsPerPage={e => this.setRowsPerPage(e)}
        />

        <Modal show={modalOpen} onClose={() => this.onCloseModal()}>
          {modal && typeof modal === 'function' ? React.createElement(modal, datasetInfo) : null}
        </Modal>
      </div>
    );
  }
}

Table.propTypes = {
  limit: PropTypes.number,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired
};

export default Table;
