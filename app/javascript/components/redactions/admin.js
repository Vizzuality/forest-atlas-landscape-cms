const initialState = {
  pages: null
}

export const SET_ADMIN_PAGES = '@admin/SET_PAGES';
export const SET_ADMIN_DATASETS = '@admin/SET_DATASETS';

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

export default (state=initialState, action) => {
  switch (action.type) {
  case SET_ADMIN_PAGES:
    return { ...state, pages: action.pages };
  case SET_ADMIN_DATASETS:
    return { ...state, datasets: action.datasets };
  default:
    return state;
  }
}
