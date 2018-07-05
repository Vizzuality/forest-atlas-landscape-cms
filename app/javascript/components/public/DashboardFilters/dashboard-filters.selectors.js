import { createSelector } from 'reselect';

const getWidget = state => state.dashboard.widget;
const getFields = state => state.dashboard.fields.data;
const getFilters = state => state.dashboardFilters.filters;

/**
 * Return the list of fields that can be used as filters
 */
export const getAvailableFields = createSelector(
  [getWidget, getFields, getFilters],
  (widget, fields, filters) => fields.filter(f => (
    [...widget.filters, ...filters].findIndex(wf => wf.name === f.name) === -1
  ))
);
