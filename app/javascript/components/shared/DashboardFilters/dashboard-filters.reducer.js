export const ADD_FILTER = 'DASHBOARD_FILTERS/ADD_FILTER';
export const REMOVE_FILTER = 'DASHBOARD_FILTERS/REMOVE_FILTER';
export const UPDATE_FILTER = 'DASHBOARD_FILTERS/UPDATE_FILTER';
export const RESET_FILTERS = 'DASHBOARD_FILTERS/RESET_FILTERS';

const initialState = {
  filters: [
    {} // One empty filter by default
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_FILTER:
      return Object.assign({}, state, { filters: [...state.filters, action.payload] });

    case REMOVE_FILTER: {
      const filters = [...state.filters];
      const index = filters.findIndex(f => f.name === action.payload.name);
      if (index !== -1) {
        filters.splice(index, 1);
        return Object.assign({}, state, { filters });
      }
      return state;
    }

    case UPDATE_FILTER: {
      const filters = [...state.filters];
      const index = filters.findIndex(f => f.name === action.payload.filter.name);
      if (index !== -1) {
        filters.splice(index, 1, action.payload.newFilter);
        return Object.assign({}, state, { filters });
      }
      return state;
    }

    case RESET_FILTERS:
      return initialState;

    default:
      return state;
  }
};
