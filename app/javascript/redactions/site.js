const initialState = {
  current: null,
  page: null,
  settings: null,
  meta: {
    // Will be different, just setting up for now
    image: null,
    pageSize: null,
    siteTitleOnly: false
  },
  dashboard: null
};

export const SET_SITE = '@public/SET_SITE';
export const SET_PAGE = '@public/SET_PAGE';
export const SET_META = '@public/SET_META';
export const SET_SITE_SETTINGS = '@public/SET_SITE_SETTINGS';
export const SET_DASHBOARD_DATA = '@public/SET_DASHBOARD';

export function setSite(current) {
  return {
    type: SET_SITE,
    current
  };
}

export function setSiteSettings(settings) {
  return {
    type: SET_SITE_SETTINGS,
    settings
  };
}

export function setPage(page) {
  return {
    type: SET_PAGE,
    page
  };
}

export function setMeta(meta) {
  return {
    type: SET_META,
    meta
  };
}

export function setDashboardData(dashboard) {
  return {
    type: SET_DASHBOARD_DATA,
    dashboard
  };
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SITE:
      return { ...state, current: action.current };
    case SET_PAGE:
      return { ...state, page: action.page };
    case SET_META:
      return { ...state, meta: action.meta };
    case SET_SITE_SETTINGS:
      return { ...state, settings: action.settings };
    case SET_DASHBOARD_DATA:
      return { ...state, dashboard: action.dashboard };
    default:
      return state;
  }
};
