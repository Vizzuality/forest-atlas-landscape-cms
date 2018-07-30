import {
  SET_TABS,
  SET_TAB,
  SET_FIELDS_LOADING,
  SET_FIELDS_ERROR,
  SET_FIELDS_DATA,
  SET_DATASET_LOADING,
  SET_DATASET_ERROR,
  SET_DATASET_DATA,
  SET_WIDGET_LOADING,
  SET_WIDGET_ERROR,
  SET_WIDGET_DATA,
  SET_DATASET_ID,
  SET_WIDGET_ID,
  SET_PAGE_SLUG,
  SET_DETAILS_VISIBILITY
} from 'components/shared/Dashboard/dashboard.reducer';

import {
  isAcceptedType,
  isAcceptedField,
  getStandardType
} from 'helpers/api';

/**
 * Set the selected tab
 * @param {{ name: string }} tab Selected Tab
 */
export const setSelectedTab = tab => ({
  type: SET_TAB,
  payload: tab.name
});

/**
 * Fetch the fields of the dataset
 */
export const fetchFields = () => (
  (dispatch, getState) => {
    dispatch({ type: SET_FIELDS_LOADING, payload: true });
    dispatch({ type: SET_FIELDS_ERROR, payload: false });

    return fetch(`${ENV.API_URL}/fields/${getState().dashboard.datasetId}?application=${ENV.API_APPLICATIONS}&env=${ENV.API_ENV}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ fields: rawFields }) => {
        const fields = Object.keys(rawFields)
          .filter(fieldName => isAcceptedType(rawFields[fieldName].type) && isAcceptedField(fieldName))
          .map(fieldName => ({
            name: fieldName,
            type: getStandardType(rawFields[fieldName].type)
          }));

        dispatch({ type: SET_FIELDS_DATA, payload: fields });
      })
      .catch(() => dispatch({ type: SET_FIELDS_ERROR, payload: true }))
      .then(() => dispatch({ type: SET_FIELDS_LOADING, payload: false }));
  }
);

/**
 * Fetch the dataset of the dashboard
 */
export const fetchDataset = () => (
  (dispatch, getState) => {
    dispatch({ type: SET_DATASET_LOADING, payload: true });
    dispatch({ type: SET_DATASET_ERROR, payload: false });

    return fetch(`${ENV.API_URL}/dataset/${getState().dashboard.datasetId}?includes=layer,widget,metadata&application=${ENV.API_APPLICATIONS}&env=${ENV.API_ENV}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ data }) => {
        dispatch({ type: SET_DATASET_DATA, payload: data });

        if (data.attributes.provider === 'featureservice') {
          dispatch({
            type: SET_TABS,
            payload: [
              { name: 'Chart' },
              { name: 'Map' },
              { name: 'Table' }
            ]
          });
        }
      })
      .catch(() => dispatch({ type: SET_DATASET_ERROR, payload: true }))
      .then(() => dispatch({ type: SET_DATASET_LOADING, payload: false }));
  }
);

/**
 * Fetch the widget of the dashboard
 */
export const fetchWidget = () => (
  (dispatch, getState) => {
    dispatch({ type: SET_WIDGET_LOADING, payload: true });
    dispatch({ type: SET_WIDGET_ERROR, payload: false });

    return fetch(`${ENV.API_URL}/widget/${getState().dashboard.widgetId}?includes=metadata&application=${ENV.API_APPLICATIONS}&env=${ENV.API_ENV}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(({ data }) => dispatch({
        type: SET_WIDGET_DATA,
        payload: Object.assign({}, { id: data.id }, data.attributes)
      }))
      .catch(() => dispatch({ type: SET_WIDGET_ERROR, payload: true }))
      .then(() => dispatch({ type: SET_WIDGET_LOADING, payload: false }));
  }
);

/**
 * Set the page slug in the store
 */
export const setPageSlug = pageSlug => ({
  type: SET_PAGE_SLUG,
  payload: pageSlug
});

/**
 * Set the ID of the dataset
 */
export const setDatasetId = datasetId => ({
  type: SET_DATASET_ID,
  payload: datasetId
});

/**
 * Set the ID of the widget
 */
export const setWidgetId = widgetId => ({
  type: SET_WIDGET_ID,
  payload: widgetId
});

/**
 * Set the visibility of the dataset's details
 */
export const setDetailsVisibility = visible => ({
  type: SET_DETAILS_VISIBILITY,
  payload: visible
});
