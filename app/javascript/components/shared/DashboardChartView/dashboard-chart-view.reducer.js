export const SET_CHART_LOADING = 'DASHBOARD_CHART_VIEW/SET_CHART_LOADING';
export const SET_LOADING = 'DASHBOARD_CHART_VIEW/SET_LOADING';
export const SET_DATA = 'DASHBOARD_CHART_VIEW/SET_DATA';
export const SET_ERROR = 'DASHBOARD_CHART_VIEW/SET_ERROR';

const initialState = {
  loading: false,
  chartLoading: false,
  error: false,
  data: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return Object.assign({}, state, { loading: action.payload });

    case SET_CHART_LOADING:
      return Object.assign({}, state, { chartLoading: action.payload });

    case SET_DATA:
      return Object.assign({}, state, { data: action.payload });

    case SET_ERROR:
      return Object.assign({}, state, { error: action.payload });

    default:
      return state;
  }
};
