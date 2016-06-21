import { INIT, WIDGET_UPDATE, LOADING } from '../actions/widgets-list';

const initialWidgetsState = {
  loading: true,
  widgets: []
};

function widgetsList(state = initialWidgetsState, action) {
  switch (action.type) {
    case INIT:
      return Object.assign({}, state, { widgets: action.payload.data });
    case LOADING:
      return Object.assign({}, state, { loading: action.payload.loading });
    case WIDGET_UPDATE:
      return Object.assign({}, state, { widgets: action.payload.data });
    default:
      return state;
  }
}

export default widgetsList;
