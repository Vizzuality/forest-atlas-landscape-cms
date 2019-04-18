import { createSelector } from 'reselect';
import format from 'date-fns/format';

import { getDatasetDownloadUrls, getSqlFilters } from 'helpers/api';
import { getFields } from 'components/shared/Dashboard/dashboard.selectors';

export const getDatasetId = state => state.dashboard.datasetId;
const getDatasetProvider = state => !state.dashboard.dataset.loading && !state.dashboard.dataset.error
  && state.dashboard.dataset.data
  ? state.dashboard.dataset.data.attributes.provider
  : null;
const getFilters = state => state.dashboardFilters.filters;
const getData = state => state.dashboardTable.data;

/**
 * Return the SQL query used to fetch the data of the
 * dashboard
 */
export const getSQLQuery = createSelector(
  [getDatasetProvider, getFields, getFilters],
  (datasetProvider, fields, dashboardFilters) => {
    const filters = getSqlFilters(dashboardFilters, datasetProvider);

    return `
      SELECT ${fields.map(f => f.name)}
      FROM data
      ${filters.length ? `WHERE ${filters}` : ''}
      LIMIT 500
    `;
  }
);

/**
 * Return a dictionary of the file formats and their
 * download URLs
 */
export const getDownloadUrls = createSelector(
  [getDatasetId, getDatasetProvider, getSQLQuery],
  (datasetId, datasetProvider, sql) => {
    return getDatasetDownloadUrls(datasetId, datasetProvider, sql.replace(/LIMIT \d+/, ''));
  }
);

/**
 * Return the body of the request necessary to display the
 * content of the table
 */
export const getDataBody = createSelector(
  [getSQLQuery],
  sql => JSON.stringify({ sql })
);

/**
 * Return the name of the columns of the data
 */
export const getDataColumns = createSelector(
  [getData, getFields],
  (data, fields) => {
    if (!data.length) {
      return [];
    }

    // The order of the columns must be the same as the order of the data returned by getTableDada,
    // that's why the columns are computed based on the data rather than only on the fields
    return Object.keys(data[0]).map((f) => {
      const field = fields.find(fi => fi.name === f);
      if (field) return field.alias || field.name;
      return undefined;
    }).filter(column => !!column);
  }
);

/**
 * Return the data formatted for the table
 */
export const getTableData = createSelector(
  [getData, getFields],
  (data, fields) => data.map(row => (
    Object.keys(row)
      .map(key => fields.find(f => f.name === key))
      .filter(field => !!field)
      .map((field) => {
        // We use the alias as key so the table can match
        // the header cells with the content cells
        const key = field.alias || field.name;

        let value = row[field.name];
        if (field.type === 'string' && value && value.length > 25) {
          value = `${value.slice(0, 22)}...`;
        } else if (field.type === 'date' && value !== null && value !== undefined) {
          const date = new Date(value);

          value = format(date, 'DD-MM-YYYY');
        }

        return {
          [key]: {
            value,
            title: value,
            sortable: true
          }
        };
      })
      .reduce((res, o) => Object.assign(res, o), {})
  ))
);
