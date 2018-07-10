export const SET_LOADING = 'DASHBOARD_TABLE/SET_LOADING';
export const SET_ERROR = 'DASHBOARD_TABLE/SET_ERROR';
export const SET_DATA = 'DASHBOARD_TABLE/SET_DATA';

const initialState = {
  loading: false,
  error: false,
  data: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return Object.assign({}, state, { loading: action.payload });

    case SET_ERROR:
      return Object.assign({}, state, { error: action.payload });

    case SET_DATA:
      return Object.assign({}, state, { data: action.payload });

    default:
      return state;
  }
};
