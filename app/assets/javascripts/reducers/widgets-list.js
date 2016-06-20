import { INIT, LOADING } from '../actions/widgets-list';

const initialWidgetsState = {
  loading: true,
  widgets: []
};

function widgetsList(state = initialWidgetsState, action) {
  switch (action.type) {
    case INIT:
      return Object.assign({}, state, { widgets: action.payload.data });
    case LOADING:
      return Object.assign({}, state, { loading: false });
    default:
      return state;
  }
}

export default widgetsList;
