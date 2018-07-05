import {
  ADD_FILTER,
  REMOVE_FILTER,
  UPDATE_FILTER,
  RESET_FILTERS
} from 'components/public/DashboardFilters/dashboard-filters.reducer';

import { getAvailableFields } from 'components/public/DashboardFilters/dashboard-filters.selectors';

export const addFilter = filter => (
  (dispatch) => {
    dispatch({
      type: ADD_FILTER,
      payload: filter
    });

    dispatch(checkFilterCompleteness(filter));
  }
);

export const removeFilter = (filter) => {
  return (dispatch, getState) => {
    const availableFields = getAvailableFields(getState());
    dispatch({
      type: REMOVE_FILTER,
      payload: filter
    });

    // If the user removed the last filter, we automatically
    // add a new empty one
    if (availableFields.length === 0) {
      dispatch(addFilter({}));
    }
  };
};

export const updateFilter = (filter, newFilter, checkCompleteness = true) => (
  (dispatch) => {
    dispatch({
      type: UPDATE_FILTER,
      payload: { filter, newFilter }
    });

    // If we want to check whether we have the possible
    // values of the filter
    // If we don't, we fetch them and update the filter
    if (checkCompleteness) {
      dispatch(checkFilterCompleteness(newFilter));
    }
  }
);

export const resetFilters = () => ({
  type: RESET_FILTERS
});

export const checkFilterCompleteness = filter => (
  (dispatch, getState) => {
    const isNumberFilter = filter.type === 'number';
    const isDateFilter = filter.type === 'date';
    const isStringFilter = filter.type === 'string';

    const availableFields = getAvailableFields(getState());

    if (filter.name && (isNumberFilter || isDateFilter) && (!filter.min || !filter.max)) {
      dispatch(getFilterMinMax(filter));

      // We automatically add a new empty filter when the user
      // as selected the column of the current one
      if (availableFields.length) {
        dispatch(addFilter({}));
      }
    } else if (filter.name && isStringFilter && !filter.possibleValues) {
      dispatch(getFilterPossibleValues(filter));

      // We automatically add a new empty filter when the user
      // as selected the column of the current one
      if (availableFields.length) {
        dispatch(addFilter({}));
      }
    }
  }
);

export const getFilterMinMax = filter => (
  (dispatch, getState) => {
    dispatch(updateFilter(
      filter,
      Object.assign({}, filter, { loading: true, error: false }),
      false
    ));

    const query = `SELECT min(${filter.name}) AS min, max(${filter.name}) AS max FROM ${getState().dashboard.datasetId}`;

    fetch(`${ENV.API_URL}/query?sql=${query}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ data }) => data)
      .then(data => (data ? data[0] : { min: -Infinity, max: Infinity }))
      .then(({ min, max }) => dispatch(updateFilter(filter, Object.assign(
        {},
        filter,
        {
          min: Math.floor(min),
          max: Math.ceil(max),
          values: [Math.floor(min), Math.ceil(max)],
          loading: false
        }
      ))))
      .catch((err) => {
        console.error(err);
        dispatch(updateFilter(
          filter,
          Object.assign({}, filter, { error: true, loading: false }),
          false
        ));
      });
  }
);

export const getFilterPossibleValues = filter => (
  (dispatch, getState) => {
    dispatch(updateFilter(
      filter,
      Object.assign({}, filter, { loading: true, error: false }),
      false
    ));

    const query = `SELECT ${filter.name} FROM ${getState().dashboard.datasetId} GROUP BY ${filter.name} ORDER BY ${filter.name}`;

    fetch(`${ENV.API_URL}/query?sql=${query}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ data }) => data)
      .then(data => (data || []).map(d => d[filter.name]))
      .then(possibleValues => dispatch(updateFilter(
        filter,
        Object.assign({}, filter, { possibleValues, values: [], loading: false })
      )))
      .catch((err) => {
        console.error(err);
        dispatch(updateFilter(
          filter,
          Object.assign({}, filter, { error: true, loading: false }),
          false
        ));
      });
  }
);
