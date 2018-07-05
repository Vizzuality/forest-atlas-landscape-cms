import { connect } from 'react-redux';

import DashboardTableView from 'components/public/DashboardTableView/dashboard-table-view.component';

import { getDataColumns, getTableData } from 'components/public/DashboardTableView/dashboard-table-view.selectors';

const mapStateToProps = state => ({
  loading: state.dashboardTable.loading,
  error: state.dashboardTable.error,
  columns: getDataColumns(state),
  data: getTableData(state)
});

export default connect(mapStateToProps, null)(DashboardTableView);
