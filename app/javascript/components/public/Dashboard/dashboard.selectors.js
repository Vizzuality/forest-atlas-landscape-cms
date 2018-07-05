import { createSelector } from 'reselect';

import { isMapWidget, isVegaWidget, getWidgetsFromDataset } from 'helpers/api';

const getData = state => state.dashboard.data.data;
const getFields = state => state.dashboard.fields.data;
const getDataset = state => state.dashboard.dataset.data;

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
 * Return the widgets associated with the dataset
 */
export const getWidgets = createSelector(
  [getDataset],
  dataset => getWidgetsFromDataset(dataset)
);

/**
 * Return the map widgets associated with the dataset
 */
export const getMapWidgets = createSelector(
  [getWidgets],
  widgets => widgets.filter(w => isMapWidget(w))
);

/**
 * Return the vega widgets associated with the dataset
 */
export const getVegaWidgets = createSelector(
  [getWidgets],
  widgets => widgets.filter(w => isVegaWidget(w))
);
