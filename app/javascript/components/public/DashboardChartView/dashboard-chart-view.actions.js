import {
  SET_CHART_LOADING,
  SET_LOADING,
  SET_ERROR,
  SET_DATA
} from 'components/public/DashboardChartView/dashboard-chart-view.reducer';

import { getVegaWidgetDataQuery } from 'components/public/DashboardChartView/dashboard-chart-view.selectors';

/**
 * Set the loading state of the data
 * @param {boolean} isLoading Whether the data is loading
 */
export const setLoading = isLoading => ({
  type: SET_LOADING,
  payload: isLoading
});

/**
 * Set the loading state of the chart
 * @param {boolean} isLoading Whether the chart is loading
 */
export const setChartLoading = isLoading => ({
  type: SET_CHART_LOADING,
  payload: isLoading
});

export const setError = hasError => ({
  type: SET_ERROR,
  payload: hasError
});

export const setData = data => ({
  type: SET_DATA,
  payload: data
});

export const fetchVegaWidgetData = () => (
  (dispatch, getState) => {
    dispatch({ type: SET_LOADING, payload: true });
    dispatch({ type: SET_ERROR, payload: false });

    return fetch(`${ENV.API_URL}/query?sql=${getVegaWidgetDataQuery(getState())}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ data }) => dispatch({ type: SET_DATA, payload: data }))
      .catch(() => dispatch({ type: SET_ERROR, payload: true }))
      .then(() => dispatch({ type: SET_LOADING, payload: false }));
  }
);
