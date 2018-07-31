import { SET_SQL_WHERE } from 'components/shared/DashboardMapView/dashboard-map-view.reducer';

import { getSqlWhere } from 'components/shared/DashboardMapView/dashboard-map-view.selectors';

export const setSqlWhere = () => (dispatch, getState) => {
  dispatch({
    type: SET_SQL_WHERE,
    payload: getSqlWhere(getState())
  });
};
