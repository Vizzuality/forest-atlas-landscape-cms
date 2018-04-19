const initialState = {
  pages: null,
  datasets: null,
  sites: null,
  widgets: null,
  users: null,
  meta: null
}

export const SET_ADMIN_PAGES = '@admin/SET_PAGES';
export const SET_ADMIN_DATASETS = '@admin/SET_DATASETS';
export const SET_ADMIN_WIDGETS = '@admin/SET_WIDGETS';
export const SET_ADMIN_SITES = '@admin/setSites';
export const SET_ADMIN_USERS = '@admin/setUsers';
export const SET_ADMIN_META = '@admin/setMeta';
export const SET_ADMIN_MAPS = '@admin/setMaps';

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

export function setSites(sites) {
  return {
    type: SET_ADMIN_SITES,
    sites
  }
}

export function setUsers(users) {
  return {
    type: SET_ADMIN_USERS,
    users
  }
}

export function setMaps(maps) {
  return {
    type: SET_ADMIN_MAPS,
    maps
  }
}

export function setMeta(meta) {
  return {
    type: SET_ADMIN_META,
    meta
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
  case SET_ADMIN_SITES:
    return { ...state, sites: action.sites };
  case SET_ADMIN_USERS:
    return { ...state, users: action.users };
  case SET_ADMIN_MAPS:
    return { ...state, maps: action.maps };
  case SET_ADMIN_META:
    return { ...state, meta: action.meta };
  default:
    return state;
  }
}
