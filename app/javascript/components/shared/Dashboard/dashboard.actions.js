import {
  SET_TAB,
  SET_FIELDS_LOADING,
  SET_FIELDS_ERROR,
  SET_FIELDS_DATA,
  SET_DATASET_LOADING,
  SET_DATASET_ERROR,
  SET_DATASET_DATA,
  SET_WIDGET,
  SET_PAGE_SLUG
} from 'components/shared/Dashboard/dashboard.reducer';

import {
  isAcceptedType,
  getStandardType,
  getWidgetsFromDataset,
  isVegaWidget,
  getVegaWidgetQueryParams
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
          .filter(fieldName => isAcceptedType(rawFields[fieldName].type))
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

        // FIXME: the widget displayed in the dashboard
        // should be chosen by the admin, not the first one
        const widgets = getWidgetsFromDataset(data);
        const widget = widgets.filter(w => isVegaWidget(w))[0];
        const widgetQueryParams = getVegaWidgetQueryParams(widget);

        if (widget && Object.keys(widgetQueryParams).length) {
          dispatch({ type: SET_WIDGET, payload: widgetQueryParams });
        }
      })
      .catch(() => dispatch({ type: SET_DATASET_ERROR, payload: true }))
      .then(() => dispatch({ type: SET_DATASET_LOADING, payload: false }));
  }
);

/**
 * Set the page slug in the store
 */
export const setPageSlug = pageSlug => ({
  type: SET_PAGE_SLUG,
  payload: pageSlug
});
