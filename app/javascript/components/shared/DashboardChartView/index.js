import { connect } from 'react-redux';

import DashboardChartView from 'components/shared/DashboardChartView/dashboard-chart-view.component';
import { getVegaWidgets } from 'components/shared/Dashboard/dashboard.selectors';
import { setChartLoading } from 'components/shared/DashboardChartView/dashboard-chart-view.actions';

/**
 * Return the widget up-to-date with the filters
 * of the dashboard
 * @param {any} state Redux store
 */
const getUpdatedWidget = (state) => {
  // FIXME: let the user which widget to display
  // instead of selecting the first one of the dataset
  const widget = getVegaWidgets(state)[0];
  if (!widget) {
    return {};
  }

  if (state.dashboardChart.loading || state.dashboardChart.error) {
    return widget;
  }

  const { data } = widget.widgetConfig;
  const dataIndex = data.findIndex(d => !!d.url);

  let updatedData;
  if (dataIndex === -1) {
    updatedData = data;
  } else {
    updatedData = [...widget.widgetConfig.data];
    updatedData.splice(dataIndex, 1, Object.assign(
      {},
      data[dataIndex],
      { values: state.dashboardChart.data, url: undefined },
      { format: Object.assign({}, data[dataIndex].format, { property: undefined }) }
    ));
  }

  return Object.assign(
    {},
    widget,
    { widgetConfig: Object.assign({}, widget.widgetConfig, { data: updatedData }) }
  );
};

const mapStateToProps = state => ({
  widget: getUpdatedWidget(state),
  chartLoading: state.dashboardChart.chartLoading,
  loading: state.dashboardChart.loading,
  error: state.dashboardChart.error
});

const mapDispatchToProps = dispatch => ({
  setChartLoading: isLoading => dispatch(setChartLoading(isLoading))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardChartView);
