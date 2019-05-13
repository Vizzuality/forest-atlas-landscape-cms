import { connect } from 'react-redux';

import DashboardFilters from 'components/shared/DashboardFilters/dashboard-filters.component';

import { getAvailableFields, getFilters } from 'components/shared/DashboardFilters/dashboard-filters.selectors';

import { addFilter, removeFilter, updateFilter, resetFilters, applyFilters } from 'components/shared/DashboardFilters/dashboard-filters.actions';

const mapStateToProps = state => ({
  fields: getAvailableFields(state),
  filters: getFilters(state)
});

const mapDispatchToProps = dispatch => ({
  onAddFilter: filter => dispatch(addFilter(filter)),
  onRemoveFilter: filter => {
    dispatch(removeFilter(filter));

    // We apply the filters again
    dispatch(applyFilters());
  },
  onChangeFilter: (filter, newFilter) => dispatch(updateFilter(filter, newFilter)),
  onResetFilters: () => {
    dispatch(resetFilters());
    dispatch(applyFilters());
  },
  onApplyFilters: () => dispatch(applyFilters())
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilters);
