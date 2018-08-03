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

    // NOTE: the encodeURIComponent function is called because Chrome won't
    // allow requests with both \n, \r or \t and characters like > or <:
    // https://www.chromestatus.com/feature/5735596811091968
    return encodeURIComponent(`
      SELECT ${fields.map(f => f.name)}
      FROM ${datasetId}
      ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
      LIMIT 500
    `);
  }
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
