const initialState = { dashboard: {}, widgets: null };

export const SET_DASHBOARD = '@dashboard/SET_DASHBOARD';
export const SET_WIDGETS = '@dashboard/SET_WIDGETS';

export function setDashboardData(dashboard) {
  return {
    type: SET_DASHBOARD,
    dashboard
  };
}

export function setDashboardWidgets(widgets) {
  return {
    type: SET_WIDGETS,
    widgets
  };
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD:
      return { ...state, dashboard: action.dashboard };
    case SET_WIDGETS:
      return { ...state, widgets: action.widgets };
    default:
      return state;
  }
};
