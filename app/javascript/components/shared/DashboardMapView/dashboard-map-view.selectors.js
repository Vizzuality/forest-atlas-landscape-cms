import { createSelector } from 'reselect';

import { getDataset } from 'components/shared/Dashboard/dashboard.selectors';
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
  filters => filters.map((filter) => {
    if (!filter.values || !filter.values.length) return null;

    if (filter.type === 'string') {
      const whereClause = `${filter.name} IN ('${filter.values.join('\', \'')}')`;
      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    if (filter.type === 'number') {
      const whereClause = `${filter.name} >= ${filter.values[0]} AND ${filter.name} <= ${filter.values[1]}`;
      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    if (filter.type === 'date') {
      const whereClause = `${filter.name} >= '${filter.values[0]}' AND ${filter.name} <= '${filter.values[1]}'`;
      return filter.notNull ? `${whereClause} AND ${filter.name} IS NOT NULL` : whereClause;
    }

    return null;
  })
    .filter(f => !!f)
    .join(' AND ')
);
