import {
  SET_DATA,
  SET_ERROR,
  SET_LOADING
} from 'components/shared/DashboardTableView/dashboard-table-view.reducer';

import { getDatasetId, getDataBody } from 'components/shared/DashboardTableView/dashboard-table-view.selectors';

/**
 * Fetch the data of the dataset
 */
export const fetchData = () => (
  (dispatch, getState) => {
    dispatch({ type: SET_LOADING, payload: true });
    dispatch({ type: SET_ERROR, payload: false });

    return fetch(`${ENV.API_URL}/query/${getDatasetId(getState())}`, {
      method: 'POST',
      body: getDataBody(getState()),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
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
