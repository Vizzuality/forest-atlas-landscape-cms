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
  [getNonEmptyFilters],
  filters => getSqlFilters(filters)
);

/**
 * Return a key-value object where the keys are the names
 * of the fields and the values their display names (aliases
 * or original names)
 */
export const getFieldsDisplayNames = createSelector(
  [getFields],
  fields => fields.reduce((res, f) => Object.assign(res, { [f.name]: f.alias || f.name }), {})
);
