import { connect } from 'react-redux';

import DashboardComponent from 'components/public/Dashboard/dashboard.component';

import { setSelectedTab, fetchFields, fetchDataset } from 'components/public/Dashboard/dashboard.actions';
import { fetchData } from 'components/public/DashboardTableView/dashboard-table-view.actions';
import { getMapWidgets, getVegaWidgets } from 'components/public/Dashboard/dashboard.selectors';
import { fetchVegaWidgetData } from 'components/public/DashboardChartView/dashboard-chart-view.actions';

const mapStateToProps = state => ({
  tabs: state.dashboard.tabs,
  selectedTab: state.dashboard.selectedTab,
  loading: state.dashboardTable.loading || state.dashboard.fields.loading
    || state.dashboard.dataset.loading,
  error: state.dashboardTable.error || state.dashboard.fields.error
    || state.dashboard.dataset.error,
  mapWidgets: getMapWidgets(state),
  vegaWidgets: getVegaWidgets(state)
});

const mapDispatchToProps = dispatch => ({
  onChangeTab: tab => dispatch(setSelectedTab(tab)),
  fetchData: () => dispatch(fetchData()),
  fetchFields: () => dispatch(fetchFields()),
  fetchDataset: () => dispatch(fetchDataset()),
  fetchChartData: () => dispatch(fetchVegaWidgetData())
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
