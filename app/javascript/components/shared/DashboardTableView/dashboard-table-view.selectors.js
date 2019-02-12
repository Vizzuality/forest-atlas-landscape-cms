import { createSelector } from 'reselect';

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
  [getDatasetId, getFields, getFilters],
  (datasetId, fields, dashboardFilters) => {
    const filters = getSqlFilters(dashboardFilters);

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
    return getDatasetDownloadUrls(datasetId, datasetProvider, sql);
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

    return Object.keys(data[0]).map((f) => {
      const field = fields.find(fi => fi.name === f);
      if (field) return field.alias || field.name;
      return f;
    });
  }
);

/**
 * Return the data formatted for the table
 */
export const getTableData = createSelector(
  [getData, getFields],
  (data, fields) => data.map(r => (
    Object.keys(r)
      .map((k) => {
        const field = fields.find(f => f.name === k);

        // We use the alias as key so the table can match
        // the header cells with the content cells
        const key = field ? (field.alias || field.name) : k;

        return {
          [key]: {
            value: typeof r[k] === 'string' && r[k].length > 25
              ? `${r[k].slice(0, 22)}...`
              : r[k],
            title: r[k],
            sortable: true
          }
        };
      })
      .reduce((res, o) => Object.assign(res, o), {})
  ))
);
