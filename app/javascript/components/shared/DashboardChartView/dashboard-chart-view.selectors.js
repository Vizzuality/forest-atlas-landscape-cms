import { createSelector } from 'reselect';

import { getVegaWidgetQueryParams } from 'helpers/api';

const getDatasetId = state => state.dashboard.datasetId;
const getWidget = state => state.dashboard.widget.data;
const getFilters = state => state.dashboardFilters.filters;

/**
 * Return the SQL query necessary to display the Vega widget
 */
export const getVegaWidgetDataQuery = createSelector(
  [getDatasetId, getWidget, getFilters],
  (datasetId, widget, dashboardFilters) => {
    if (!datasetId || !widget) {
      return null;
    }

    const widgetParams = getVegaWidgetQueryParams(widget);

    const fields = Object.keys(widgetParams).length
      ? Object.keys(widgetParams.fields).map(name => `${widgetParams.fields[name].aggregation ? `${widgetParams.fields[name].aggregation}(${widgetParams.fields[name].name})` : widgetParams.fields[name].name} as ${name}`)
      : ['*'];

    const filters = widgetParams.filters.concat(dashboardFilters)
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
      SELECT ${fields}
      FROM ${datasetId}
      ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
      ${widgetParams.fields.y && widgetParams.fields.y.aggregation ? 'GROUP BY x' : ''}
      ${widgetParams.order ? `ORDER BY ${widgetParams.order.field} ${widgetParams.order.direction}` : ''}
      LIMIT ${widgetParams.limit}
    `);
  }
);
