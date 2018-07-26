export const SET_TAB = 'DASHBOARD/SET_TAB';
export const SET_FIELDS_LOADING = 'DASHBOARD/SET_FIELDS_LOADING';
export const SET_FIELDS_ERROR = 'DASHBOARD/SET_FIELDS_ERROR';
export const SET_FIELDS_DATA = 'DASHBOARD/SET_FIELDS_DATA';
export const SET_DATASET_LOADING = 'DASHBOARD/SET_DATASET_LOADING';
export const SET_DATASET_ERROR = 'DASHBOARD/SET_DATASET_ERROR';
export const SET_DATASET_DATA = 'DASHBOARD/SET_DATASET_DATA';
export const SET_DATASET_ID = 'DASHBOARD/SET_DATASET_ID';
export const SET_WIDGET_ID = 'DASHBOARD/SET_WIDGET_ID';
export const SET_WIDGET_LOADING = 'DASHBOARD/SET_WIDGET_LOADING';
export const SET_WIDGET_ERROR = 'DASHBOARD/SET_WIDGET_ERROR';
export const SET_WIDGET_DATA = 'DASHBOARD/SET_WIDGET_DATA';
export const SET_PAGE_SLUG = 'DASHBOARD/SET_PAGE_SLUG';
export const SET_DETAILS_VISIBILITY = 'DASHBOARD/SET_DETAILS_VISIBILITY';

const initialState = {
  tabs: [
    { name: 'Chart' },
    // { name: 'Map' },
    { name: 'Table' }
  ],
  selectedTab: 'Chart',
  datasetId: null,
  widgetId: null,
  pageSlug: null,
  detailsVisible: false,
  fields: {
    loading: false,
    error: false,
    data: []
  },
  dataset: {
    loading: false,
    error: false,
    data: null
  },
  widget: {
    loading: false,
    error: false,
    data: null
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TAB:
      return Object.assign({}, state, { selectedTab: action.payload });

    case SET_FIELDS_LOADING:
      return Object.assign({}, state, {
        fields: Object.assign({}, state.fields, { loading: action.payload })
      });

    case SET_FIELDS_ERROR:
      return Object.assign({}, state, {
        fields: Object.assign({}, state.fields, { error: action.payload })
      });

    case SET_FIELDS_DATA:
      return Object.assign({}, state, {
        fields: Object.assign({}, state.fields, { data: action.payload })
      });

    case SET_DATASET_LOADING:
      return Object.assign({}, state, {
        dataset: Object.assign({}, state.dataset, { loading: action.payload })
      });

    case SET_DATASET_ERROR:
      return Object.assign({}, state, {
        dataset: Object.assign({}, state.dataset, { error: action.payload })
      });

    case SET_DATASET_DATA:
      return Object.assign({}, state, {
        dataset: Object.assign({}, state.dataset, { data: action.payload })
      });

    case SET_DATASET_ID:
      return Object.assign({}, state, { datasetId: action.payload });

    case SET_WIDGET_ID:
      return Object.assign({}, state, { widgetId: action.payload });

    case SET_WIDGET_LOADING:
      return Object.assign({}, state, {
        widget: Object.assign({}, state.widget, { loading: action.payload })
      });

    case SET_WIDGET_ERROR:
      return Object.assign({}, state, {
        widget: Object.assign({}, state.widget, { error: action.payload })
      });

    case SET_WIDGET_DATA:
      return Object.assign({}, state, {
        widget: Object.assign({}, state.widget, { data: action.payload })
      });

    case SET_PAGE_SLUG:
      return Object.assign({}, state, { pageSlug: action.payload });

    case SET_DETAILS_VISIBILITY:
      return Object.assign({}, state, { detailsVisible: action.payload });

    default:
      return state;
  }
};
