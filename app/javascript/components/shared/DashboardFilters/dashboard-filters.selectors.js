import { createSelector } from 'reselect';

import { getVegaWidgetQueryParams } from 'helpers/api';

const getWidget = state => state.dashboard.widget.data;
const getFields = state => state.dashboard.fields.data;
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
  ))
);

/**
 * Get the list of all the non-empty filters
 */
export const getNonEmptyFilters = createSelector(
  [getFiltersSelector],
  filters => filters.filter(f => f.name)
);

export const getFilters = createSelector(
  [getFiltersSelector],
  filters => filters
);
