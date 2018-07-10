import { connect } from 'react-redux';

import DashboardFilters from 'components/shared/DashboardFilters/dashboard-filters.component';

import { fetchData } from 'components/shared/DashboardTableView/dashboard-table-view.actions';
import { fetchVegaWidgetData } from 'components/shared/DashboardChartView/dashboard-chart-view.actions';
import { getAvailableFields } from 'components/shared/DashboardFilters/dashboard-filters.selectors';

import { addFilter, removeFilter, updateFilter, resetFilters } from 'components/shared/DashboardFilters/dashboard-filters.actions';

const mapStateToProps = state => ({
  fields: getAvailableFields(state),
  filters: state.dashboardFilters.filters
});

const mapDispatchToProps = dispatch => ({
  onAddFilter: filter => dispatch(addFilter(filter)),
  onRemoveFilter: filter => dispatch(removeFilter(filter)),
  onChangeFilter: (filter, newFilter) => dispatch(updateFilter(filter, newFilter)),
  onResetFilters: () => {
    dispatch(resetFilters());
    dispatch(fetchData());
    dispatch(fetchVegaWidgetData());
  },
  onApplyFilters: () => {
    dispatch(fetchData());
    dispatch(fetchVegaWidgetData());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilters);
