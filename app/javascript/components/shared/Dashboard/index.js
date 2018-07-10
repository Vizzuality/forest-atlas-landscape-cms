import { connect } from 'react-redux';

import DashboardComponent from 'components/shared/Dashboard/dashboard.component';

import { setSelectedTab, fetchFields, fetchDataset, fetchWidget, setPageSlug, setDatasetId, setWidgetId } from 'components/shared/Dashboard/dashboard.actions';
import { fetchData } from 'components/shared/DashboardTableView/dashboard-table-view.actions';
import { fetchVegaWidgetData } from 'components/shared/DashboardChartView/dashboard-chart-view.actions';

const mapStateToProps = state => ({
  tabs: state.dashboard.tabs,
  selectedTab: state.dashboard.selectedTab
});

const mapDispatchToProps = dispatch => ({
  onChangeTab: tab => dispatch(setSelectedTab(tab)),
  fetchData: () => dispatch(fetchData()),
  fetchFields: () => dispatch(fetchFields()),
  fetchDataset: () => dispatch(fetchDataset()),
  fetchWidget: () => dispatch(fetchWidget()),
  fetchChartData: () => dispatch(fetchVegaWidgetData()),
  setPageSlug: pageSlug => dispatch(setPageSlug(pageSlug)),
  setDatasetId: datasetId => dispatch(setDatasetId(datasetId)),
  setWidgetId: widgetId => dispatch(setWidgetId(widgetId))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
