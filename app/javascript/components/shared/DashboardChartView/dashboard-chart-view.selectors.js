import { createSelector } from 'reselect';

import { getDataset } from 'components/shared/Dashboard/dashboard.selectors';
import { getVegaWidgetQueryParams, getSqlFilters } from 'helpers/api';

const getDatasetId = state => state.dashboard.datasetId;
const getWidget = state => state.dashboard.widget.data;
const getFilters = state => state.dashboardFilters.filters;

/**
 * Return the SQL query necessary to display the Vega widget
 */
export const getVegaWidgetDataQuery = createSelector(
  [getDatasetId, getDataset, getWidget, getFilters],
  (datasetId, dataset, widget, dashboardFilters) => {
    if (!datasetId || !widget) {
      return null;
    }

    const widgetParams = getVegaWidgetQueryParams(widget);
    const { order } = widgetParams;

    const fields = Object.keys(widgetParams).length
      ? Object.keys(widgetParams.fields).map(name => `${widgetParams.fields[name].aggregation ? `${widgetParams.fields[name].aggregation}(${widgetParams.fields[name].name})` : widgetParams.fields[name].name} as ${name}`)
      : ['*'];

    const filters = getSqlFilters(widgetParams.filters.concat(dashboardFilters), dataset.attributes.provider);

    const groupBy = [];
    if (widgetParams.fields.y && widgetParams.fields.y.aggregation) {
      groupBy.push('x');

      if (widgetParams.fields.color) {
        groupBy.push('color');
      }
    }

    // NOTE: the encodeURIComponent function is called because Chrome won't
    // allow requests with both \n, \r or \t and characters like > or <:
    // https://www.chromestatus.com/feature/5735596811091968
    return encodeURIComponent(`
      SELECT ${fields}
      FROM ${datasetId}
      ${filters.length ? `WHERE ${filters}` : ''}
      ${groupBy && groupBy.length ? `GROUP BY ${groupBy}` : ''}
      ${order ? `ORDER BY ${order.field} ${order.direction || 'desc'}` : ''}
      LIMIT ${widgetParams.limit}
    `);
  }
);
