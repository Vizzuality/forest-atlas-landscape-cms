import { createSelector } from 'reselect';

const getData = state => state.dashboard.data.data;
export const getDataset = state => state.dashboard.dataset.data;
const getFieldsSelector = state => state.dashboard.fields.data;
const getWidget = state => state.dashboard.widget.data;
const getPageSlugSelector = state => state.dashboard.pageSlug;

/**
 * Return the data without the columns that are not
 * supposed to be shown
 */
export const getAvailableData = createSelector(
  [getData, getFieldsSelector],
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

/**
 * Return the metadata of the dataset
 */
export const getDatasetMetadata = createSelector(
  [getDataset],
  (dataset) => {
    if (dataset && dataset.attributes.metadata && dataset.attributes.metadata.length) {
      const FAMetadata = dataset.attributes.metadata.find(m => m.attributes.application === 'forest-atlas');
      const enMetadata = dataset.attributes.metadata.find(m => m.attributes.language === 'en');

      // We return, in priority, the metadata for forest-atlas or the one in English
      return FAMetadata || enMetadata || dataset.attributes.metadata[0];
    }

    return null;
  }
);

/**
 * Return the fields with their corresponding metadata
 */
export const getFields = createSelector(
  [getFieldsSelector, getDatasetMetadata],
  (fields, metadata) => {
    const res = [...fields];

    if (metadata && metadata.attributes.columns) {
      const fieldsMetadata = metadata.attributes.columns;
      Object.keys(fieldsMetadata).forEach((f) => {
        const field = res.find(fi => fi.name === f);
        if (field) {
          if (fieldsMetadata[f].alias) field.alias = fieldsMetadata[f].alias;
          if (fieldsMetadata[f].description) field.description = fieldsMetadata[f].description;
        }
      });
    }

    return res;
  }
);
