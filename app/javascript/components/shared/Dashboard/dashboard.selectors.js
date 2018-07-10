import { createSelector } from 'reselect';

const getData = state => state.dashboard.data.data;
const getFields = state => state.dashboard.fields.data;
const getWidget = state => state.dashboard.widget.data;
const getPageSlugSelector = state => state.dashboard.pageSlug;

/**
 * Return the data without the columns that are not
 * supposed to be shown
 */
export const getAvailableData = createSelector(
  [getData, getFields],
  (data, fields) => (
    data.map((row) => {
      const availableColumns = Object.keys(row)
        .filter(columnName => fields.find(f => f.name === columnName));

      return availableColumns
        .map(columnName => ({ [columnName]: row[columnName] }))
        .reduce((res, item) => Object.assign(res, item), {});
    })
  )
);

/**
 * Return the widget
 */
export const getVegaWidget = createSelector(
  [getWidget],
  widget => widget
);

/**
 * Return the page slug
 */
export const getPageSlug = createSelector(
  [getPageSlugSelector],
  pageSlug => pageSlug
);
