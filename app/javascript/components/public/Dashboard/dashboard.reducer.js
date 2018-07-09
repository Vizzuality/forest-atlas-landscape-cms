export const SET_TAB = 'DASHBOARD/SET_TAB';
export const SET_FIELDS_LOADING = 'DASHBOARD/SET_FIELDS_LOADING';
export const SET_FIELDS_ERROR = 'DASHBOARD/SET_FIELDS_ERROR';
export const SET_FIELDS_DATA = 'DASHBOARD/SET_FIELDS_DATA';
export const SET_DATASET_LOADING = 'DASHBOARD/SET_DATASET_LOADING';
export const SET_DATASET_ERROR = 'DASHBOARD/SET_DATASET_ERROR';
export const SET_DATASET_DATA = 'DASHBOARD/SET_DATASET_DATA';
export const SET_WIDGET = 'DASHBOARD/SET_WIDGET';
export const SET_PAGE_SLUG = 'DASHBOARD/SET_PAGE_SLUG';

const initialState = {
  tabs: [
    { name: 'Chart' },
    // { name: 'Map' },
    { name: 'Table' }
  ],
  selectedTab: 'Chart',
  datasetId: '5159fe6f-defd-44d2-9e7d-15665e14deeb',
  pageSlug: null,
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
    fields: [],
    filters: [],
    limit: 500,
    order: null
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

    case SET_WIDGET:
      return Object.assign({}, state, { widget: action.payload });

    case SET_PAGE_SLUG:
      return Object.assign({}, state, { pageSlug: action.payload });

    default:
      return state;
  }
};