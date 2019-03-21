import { createSelector } from 'reselect';

import { getSqlFilters } from 'helpers/api';
import { getDataset, getFields } from 'components/shared/Dashboard/dashboard.selectors';
import { getNonEmptyFilters } from 'components/shared/DashboardFilters/dashboard-filters.selectors';

export const getSqlWhereSelector = state => state.dashboardMap.sqlWhere;

export const getLayerUrl = createSelector(
  [getDataset],
  (dataset) => {
    if (!dataset
      || !dataset.attributes.provider === 'featureservice'
      || !/(MapServer|FeatureServer)/.test(dataset.attributes.connectorUrl)) {
      return null;
    }

    return dataset.attributes.connectorUrl.indexOf('?') !== -1
      ? dataset.attributes.connectorUrl.split('?')[0]
      : dataset.attributes.connectorUrl;
  }
);

export const getSqlWhere = createSelector(
  [getDataset, getNonEmptyFilters],
  (dataset, filters) => getSqlFilters(filters, dataset.attributes.provider)
);

/**
 * Return a key-value object where the keys are the names
 * of the fields and the values are objects containing their
 * display names (aliases or original names) and their types
 */
export const getFieldsInfo = createSelector(
  [getFields],
  fields => fields.reduce((res, f) => Object.assign(res, {
    [f.name]: {
      alias: f.alias || f.name,
      type: f.type
    }
  }), {})
);
