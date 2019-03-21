import { connect } from 'react-redux';

import DashboardFilters from 'components/shared/DashboardFilters/dashboard-filters.component';

import { fetchData } from 'components/shared/DashboardTableView/dashboard-table-view.actions';
import { fetchVegaWidgetData } from 'components/shared/DashboardChartView/dashboard-chart-view.actions';
import { setSqlWhere } from 'components/shared/DashboardMapView/dashboard-map-view.actions';
import { getAvailableFields, getFilters } from 'components/shared/DashboardFilters/dashboard-filters.selectors';

import { addFilter, removeFilter, updateFilter, resetFilters } from 'components/shared/DashboardFilters/dashboard-filters.actions';

const mapStateToProps = state => ({
  fields: getAvailableFields(state),
  filters: getFilters(state)
});

const mapDispatchToProps = dispatch => ({
  onAddFilter: filter => dispatch(addFilter(filter)),
  onRemoveFilter: filter => {
    dispatch(removeFilter(filter));

    // We apply the filters again
    dispatch(fetchData());
    dispatch(fetchVegaWidgetData());
    dispatch(setSqlWhere());
  },
  onChangeFilter: (filter, newFilter) => dispatch(updateFilter(filter, newFilter)),
  onResetFilters: () => {
    dispatch(resetFilters());
    dispatch(fetchData());
    dispatch(fetchVegaWidgetData());
    dispatch(setSqlWhere());
  },
  onApplyFilters: () => {
    dispatch(fetchData());
    dispatch(fetchVegaWidgetData());
    dispatch(setSqlWhere());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilters);
