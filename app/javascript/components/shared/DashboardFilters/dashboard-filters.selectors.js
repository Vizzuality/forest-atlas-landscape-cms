import { createSelector } from 'reselect';

import { getVegaWidgetQueryParams } from 'helpers/api';

import { getFields } from 'components/shared/Dashboard/dashboard.selectors';

const getWidget = state => state.dashboard.widget.data;
const getFiltersSelector = state => state.dashboardFilters.filters;

/**
 * Return the list of fields that can be used as filters
 */
export const getAvailableFields = createSelector(
  [getWidget, getFields, getFiltersSelector],
  (widget, fields, filters) => fields.filter(f => (
    [
      ...getVegaWidgetQueryParams(widget).filters,
      ...filters
    ].findIndex(wf => wf.name === f.name) === -1
  )).sort((a, b) => (a.alias || a.name).localeCompare(b.alias || b.name))
);

/**
 * Get the list of all the non-empty filters
 */
export const getNonEmptyFilters = createSelector(
  [getFiltersSelector],
  filters => filters.filter(f => f.name)
);

export const getFilters = createSelector(
  [getFiltersSelector, getFields],
  (filters, fields) => filters.map((f) => {
    const field = fields.find(fi => fi.name === f.name);

    // We add the metadata info of the fields in the filters
    if (field) {
      return Object.assign({}, f, {
        ...(field.alias ? { alias: field.alias } : {}),
        ...(field.description ? { description: field.description } : {})
      });
    }

    return f;
  })
);
