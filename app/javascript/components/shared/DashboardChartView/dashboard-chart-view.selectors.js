import { createSelector } from 'reselect';

import { getVegaWidgetQueryParams, getSqlFilters } from 'helpers/api';

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

    const filters = getSqlFilters(widgetParams.filters.concat(dashboardFilters));

    let order = widgetParams.order;
    if (!order) {
      if (widget.widgetConfig.paramsConfig.chartType === 'line') {
        order = {
          field: widgetParams.fields.x.name,
          direction: 'desc'
        };
      } else if (widget.widgetConfig.paramsConfig.value && ['pie', 'bar', 'stacked-bar', 'bar-horizontal', 'stacked-bar-horizontal'].indexOf(widget.widgetConfig.paramsConfig.chartType) !== -1) {
        order = {
          field: widgetParams.fields.y.name,
          direction: 'desc'
        };
      }
    }

    // NOTE: the encodeURIComponent function is called because Chrome won't
    // allow requests with both \n, \r or \t and characters like > or <:
    // https://www.chromestatus.com/feature/5735596811091968
    return encodeURIComponent(`
      SELECT ${fields}
      FROM ${datasetId}
      ${filters.length ? `WHERE ${filters}` : ''}
      ${widgetParams.fields.y && widgetParams.fields.y.aggregation ? 'GROUP BY x' : ''}
      ${order ? `ORDER BY ${order.field} ${order.direction}` : ''}
      LIMIT ${widgetParams.limit}
    `);
  }
);
