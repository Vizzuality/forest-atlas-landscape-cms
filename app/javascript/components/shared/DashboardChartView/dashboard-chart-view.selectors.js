import { createSelector } from 'reselect';

const getDatasetId = state => state.dashboard.datasetId;
const getWidget = state => state.dashboard.widget;
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

    const fields = Object.keys(widget).length
      ? Object.keys(widget.fields).map(name => `${widget.fields[name].aggregation ? `${widget.fields[name].aggregation}(${widget.fields[name].name})` : widget.fields[name].name} as ${name}`)
      : ['*'];

    const filters = widget.filters.concat(dashboardFilters)
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
      SELECT ${fields}
      FROM ${datasetId}
      ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
      ${widget.order ? `ORDER ${widget.order.field} ${widget.order.direction}` : ''}
      LIMIT ${widget.limit}
    `;
  }
);
