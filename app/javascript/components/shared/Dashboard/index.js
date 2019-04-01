import { connect } from 'react-redux';

import DashboardComponent from 'components/shared/Dashboard/dashboard.component';

import { setSelectedTab, fetchFields, fetchDataset, fetchWidget, setPageSlug, setDatasetId, setWidgetId, setDetailsVisibility } from 'components/shared/Dashboard/dashboard.actions';
import { fetchData } from 'components/shared/DashboardTableView/dashboard-table-view.actions';
import { fetchVegaWidgetData } from 'components/shared/DashboardChartView/dashboard-chart-view.actions';
import { getDatasetMetadata } from 'components/shared/Dashboard/dashboard.selectors';
import { getDownloadUrls } from 'components/shared/DashboardTableView/dashboard-table-view.selectors';

const mapStateToProps = state => ({
  tabs: state.dashboard.tabs,
  selectedTab: state.dashboard.selectedTab,
  detailsVisible: state.dashboard.detailsVisible,
  datasetData: state.dashboard.dataset.data,
  datasetMetadata: getDatasetMetadata(state),
  downloadUrls: getDownloadUrls(state)
});

const mapDispatchToProps = dispatch => ({
  onChangeTab: tab => dispatch(setSelectedTab(tab)),
  fetchData: () => dispatch(fetchData()),
  fetchFields: (...params) => dispatch(fetchFields(...params)),
  fetchDataset: () => dispatch(fetchDataset()),
  fetchWidget: () => dispatch(fetchWidget()),
  fetchChartData: () => dispatch(fetchVegaWidgetData()),
  setPageSlug: pageSlug => dispatch(setPageSlug(pageSlug)),
  setDatasetId: datasetId => dispatch(setDatasetId(datasetId)),
  setWidgetId: widgetId => dispatch(setWidgetId(widgetId)),
  setDetailsVisibility: visible => dispatch(setDetailsVisibility(visible))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
