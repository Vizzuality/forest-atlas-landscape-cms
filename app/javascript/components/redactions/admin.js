const initialState = {
  pages: null
}

export const SET_ADMIN_PAGES = '@admin/SET_PAGES';
export const SET_ADMIN_DATASETS = '@admin/SET_DATASETS';
export const SET_ADMIN_WIDGETS = '@admin/SET_WIDGETS';

export function setPages(pages) {
  return {
    type: SET_ADMIN_PAGES,
    pages
  };
}

export function setDatasets(datasets) {
  return {
    type: SET_ADMIN_DATASETS,
    datasets
  }
}

export function setWidgets(widgets) {
  return {
    type: SET_ADMIN_WIDGETS,
    widgets
  }
}

export default (state=initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_PAGES:
    return { ...state, pages: action.pages };
  case SET_ADMIN_DATASETS:
    return { ...state, datasets: action.datasets };
  case SET_ADMIN_WIDGETS:
    return { ...state, widgets: action.widgets };
  default:
    return state;
  }
}
