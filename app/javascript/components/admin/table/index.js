import React from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import classnames from 'classnames';

import TableActions from 'components/admin/table/TableActions';
import Toolbar from 'components/admin/table/Toolbar';
import TableFooter from 'components/admin/table/TableFooter';

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
      sort: {
        /**
         * Sort order
         * 1 for ASC, -1 for DESC
         * @type {1|-1} order
         */
        order: 1,
        /**
         * Column index used to sort the tbale
         * @type {number} columnIndex
         */
        columnIndex: 0
      },
      columns: cols,
      // when / if we get dynamic pagination, use that information instead
      pagination: {
        limit: props.limit,
        page: 1,
        offset: 0,
        pages: Math.ceil(props.data.length / props.limit)
      }
    };

    this.fuse = new Fuse(props.data, { keys: cols.map(col => `${col.toLowerCase()}.value`), ...fuseOptions });
  }

  /**
   * Event handler executed when the user
   * sorts a column
   * @param {string} column Column
   */
  onSort(column) {
    const columnIndex = this.state.columns.indexOf(column);
    if (columnIndex !== -1) {
      if (columnIndex === this.state.sort.columnIndex) {
        this.setState({ sort: { ...this.state.sort, order: this.state.sort.order * -1 } });
      } else {
        this.setState({ sort: {
          ...this.state.sort,
          columnIndex,
          order: 1
        } });
      }

      this.setState({ pagination: { ...this.state.pagination, page: 1, offset: 0 } });
    }
  }

  onSearch(e) {
    this.setState({
      q: e.target.value,
      pagination: {
        ...this.state.pagination,
        offset: 0,
        page: 1
      }
    });
  }

  setRowsPerPage(e) {
    const pagination = {
      ...this.state.pagination,
      limit: parseInt(e.target.value),
      pages: Math.ceil(this.props.data.length / parseInt(e.target.value)),
      page: 1,
      offset: 0
    };

    this.setState({ pagination });
  }

  offsetPage(p) {
    const { offset, limit, page } = this.state.pagination;

    const newOffset = p > page ? offset + limit : offset - limit;
    const pagination = { ...this.state.pagination, page: p, offset: newOffset };

    this.setState({ pagination });
  }

  formatRow(d) {
    const { actions } = this.props;
    return (
      <tr role="row" key={d + Math.random()}>
        {this.formatCols(d)}
        {actions.map(a =>
          <TableActions data={d} action={a} onClickAction={this.props.onClickAction} />)}
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

  /**
   * Return the sorted rows
   * @param {Row[]} rows Rows
   * @returns {Row[]}
   */
  sortResults(rows) {
    return rows.sort((a, b) => {
      const column = this.state.columns[this.state.sort.columnIndex].toLowerCase();

      const cellA = a[column];
      const cellB = b[column];

      const valA = Array.isArray(cellA.value) ? cellA.value[0] : cellA.value;
      const valB = Array.isArray(cellB.value) ? cellB.value[0] : cellB.value;

      if ((valA === undefined || valA === null) && (valB === undefined || valB === null)) {
        return 0;
      } else if ((valA === undefined || valB === null) && valB) {
        return -1 * this.state.sort.order;
      } else if (valA && (valB === undefined || valB === null)) {
        return this.state.sort.order;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        if (valA < valB) return -1 * this.state.sort.order;
        if (valA > valB) return this.state.sort.order;
        return 0;
      } else if (typeof valA === 'number' && typeof valB !== 'number') {
        return -1 * this.state.sort.order;
      } else if (typeof valA !== 'number' && typeof valB === 'number') {
        return this.state.sort.order;
      }

      return valA.localeCompare(valB, [], { sensitivity: 'base' }) * this.state.sort.order;
    });
  }

  render() {
    const { data, actions, searchable } = this.props;
    const { q, sort, columns, pagination } = this.state;

    const filteredResults = this.sortResults(q.length > 0 && searchable
      ? this.fuse.search(q)
      : data);

    const sortName = sort.order === 1 ? 'ascending' : 'descending';
    const isSortable = (column) => {
      if (data.length && data[0][column.toLowerCase()]) {
        return !!data[0][column.toLowerCase()].sortable;
      }

      return false;
    };

    return (
      <div className="c-table">
        {searchable && <Toolbar q={q} onSearch={query => this.onSearch(query)} />}
        <table role="grid">
          <caption>
            {this.props.name}, sorted by {columns[sort.columnIndex]}: {sortName}
          </caption>
          <thead>
            {filteredResults.length > 0 &&
            <tr className="header" role="row">
                {columns.map((col, k) => (
                  <th
                    key={col + k}
                    aria-sort={k === sort.columnIndex ? sortName : 'none'}
                    tabIndex={k === sort.columnIndex ? '0' : '-1'}
                    className={k === sort.columnIndex ? `-order-${sortName}` : ''}
                    role="columnheader"
                    onClick={() => isSortable(col) && this.onSort(col)}
                  >{col}
                  </th>))}
                {/* Render empty rows for each action */}
                {actions && actions.map((a, k) => (<th key={a + k} aria-sort="none" role="columnheader" />))}
            </tr>
            }
          </thead>
          <tbody>
            {filteredResults &&
              filteredResults.map((d, k) => (this.verifyPagination(k) ? this.formatRow(d) : null))}

            {filteredResults.length === 0 &&
            <tr role="row">
              {q.length > 0 ? <td align="center">No results found for {q}</td> :
              <td align="center">No items to display</td>}
            </tr>}

          </tbody>
        </table>

        <TableFooter
          pagination={{
            ...pagination,
            pages: filteredResults
              ? Math.ceil(filteredResults.length / pagination.limit)
              : pagination.pages
          }}
          offsetPage={p => this.offsetPage(p)}
          setRowsPerPage={e => this.setRowsPerPage(e)}
        />
      </div>
    );
  }
}

/* eslint-disable max-len */
/**
 * Definition of a row
 * @typedef {{ [column: string]: { value?: any, searchable?: boolean, sortable?: boolean, link?: { url: string, external: boolean }, method?: string } }}  Row
 */
/* eslint-enable max-len */

Table.propTypes = {
  /**
   * Name of the table (for screen readers)
   */
  name: PropTypes.string.isRequired,
  /**
   * Number of results per page
   */
  limit: PropTypes.number,
  /**
   * Whether the user can search text in the table
   */
  searchable: PropTypes.bool,
  /**
   * Data to display in the table
   * Each row contains several columns with their value and
   * an attribute to tell if the column can be sortable
   * NOTE: The name of the columns must be in lowercase
   * NOTE: the data will always be sorted ASC by the first column
   * The value attribute can have an array of strings
   * An optional link attribute can be present, it contains its url and an attribute to tell
   * if the link is external or not (this is not built for multi-value cells)
   * An example of the format can be:
   * [
   *   {
   *     name: { value: '$3' },
   *     description: { value: ['Spain', 'France'], sortable: false },
   *     price: { value: 'iPhone 6', link: { url: 'https://www.apple.com', external: true }, searchable: false }
   *   }
   * ]
   * @type {Row[]} data
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Name of the columns
   * Make sure the name matches one attribute of the
   * rows (case insensitive)
   */
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * List of actions for each row
   * @type {'edit'|'delete'|'toggle'|'info'} actions
   */
  actions: PropTypes.arrayOf(PropTypes.oneOf(['edit', 'delete', 'toggle', 'info'])),
  /**
   * Event handler executed when the user clicks the action
   * or a row
   * Gets passed the action and the row
   * @type {(action: 'edit'|'delete'|'toggle'|'info', row: Row): function} onClickAction
   */
  onClickAction: PropTypes.func
};

Table.defaultProps = {
  limit: 10,
  searchable: false,
  actions: [],
  onClickAction: (action, data) => {
    // By default, the value is a link, so just redirect to it
    if (action in data && action !== 'delete') {
      if ('value' in data[action]) {
        window.location.href = data[action].value;
      }
    }

    if (action === 'toggle' && 'enable' in data) {
      fetch(window.location.origin + data.enable.value, {
        method: 'PUT'
      }).then(() => {
        window.location.reload();
      });
    }

    if (action === 'delete') {
      const shouldDelete = window.confirm('are you sure you want to remove this?');
      if (shouldDelete) {
        fetch(window.location.origin + data[action].value, { method: 'DELETE' }).then(() => {
          window.location.reload();
        });
      }
    }
  }
};

export default Table;
