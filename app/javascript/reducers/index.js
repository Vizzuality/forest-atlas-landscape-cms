import { combineReducers } from 'redux';
import { reducers as widgetEditorReducers } from 'widget-editor';

// Page reducers
import site from 'redactions/site';
import admin from 'redactions/admin';
import management from 'redactions/management';
import env from 'redactions/env';

// Public dashboard reducers
import DashboardReducer from 'components/shared/Dashboard/dashboard.reducer';
import DashboardChartViewReducer from 'components/shared/DashboardChartView/dashboard-chart-view.reducer';
import DashboardTableViewReducer from 'components/shared/DashboardTableView/dashboard-table-view.reducer';
import DashboardFiltersReducer from 'components/shared/DashboardFilters/dashboard-filters.reducer';
import DashboardBookmarksReducer from 'components/shared/DashboardBookmarks/dashboard-bookmarks.reducer';

const rootReducer = combineReducers({
  site,
  admin,
  management,
  env,
  ...widgetEditorReducers,
  dashboard: DashboardReducer,
  dashboardChart: DashboardChartViewReducer,
  dashboardTable: DashboardTableViewReducer,
  dashboardFilters: DashboardFiltersReducer,
  dashboardBookmarks: DashboardBookmarksReducer
});

export default rootReducer;
