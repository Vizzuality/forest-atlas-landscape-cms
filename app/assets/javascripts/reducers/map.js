import { CREATE_LAYER, LOADING_MAP } from '../actions/map';

const initialMapState = {
  layer: {}
};

function mapReducer(state = initialMapState, action) {
  switch (action.type) {
    case CREATE_LAYER:
      return Object.assign({}, state, { layer: action.payload.data });
    case LOADING_MAP:
      return Object.assign({}, state, { loading: action.payload.loading });
    default:
      return state;
  }
}

export default mapReducer;
