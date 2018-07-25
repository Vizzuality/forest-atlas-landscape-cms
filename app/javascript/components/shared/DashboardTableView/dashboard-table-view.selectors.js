import { createSelector } from 'reselect';

import { getFields } from 'components/shared/Dashboard/dashboard.selectors';

const getDatasetId = state => state.dashboard.datasetId;
const getFilters = state => state.dashboardFilters.filters;
const getData = state => state.dashboardTable.data;

/**
 * Return the SQL query necessary to display the content of the table
 */
export const getDataQuery = createSelector(
  [getDatasetId, getFields, getFilters],
  (datasetId, fields, dashboardFilters) => {
    const filters = dashboardFilters
      .map((filter) => {
        if (!filter.values || !filter.values.length) return null;

        if (filter.type === 'string') {
          const whereClause = `${filter.name} IN ('${filter.values.join('\', \'')}')`;
          return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
        }

        if (filter.type === 'number') {
          const whereClause = `${filter.name} >= ${filter.values[0]} AND ${filter.name} <= ${filter.values[1]}`;
          return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
        }

        if (filter.type === 'date') {
          const whereClause = `${filter.name} >= '${filter.values[0]}' AND ${filter.name} <= '${filter.values[1]}'`;
          return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
        }

        return null;
      })
      .filter(f => !!f);

    return `
      SELECT ${fields.map(f => f.name)}
      FROM ${datasetId}
      ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
      LIMIT 500
    `;
  }
);

/**
 * Return the name of the columns of the data
 */
export const getDataColumns = createSelector(
  [getData],
  (data) => {
    if (!data.length) {
      return [];
    }
    return Object.keys(data[0]).filter(c => c !== '_id');
  }
);

/**
 * Return the data formatted for the table
 */
export const getTableData = createSelector(
  [getData],
  data => data.map(r => (
    Object.keys(r)
      .map(k => ({ [k]: { value: r[k], sortable: true } }))
      .reduce((res, o) => Object.assign(res, o), {})
  ))
);
