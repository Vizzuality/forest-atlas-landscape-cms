export const SET_SITE = '@publicSite/SET_SITE';
export const SET_PAGE = '@publicSite/SET_PAGE';
export const SET_META = '@publicSite/SET_META';
export const SET_SITE_SETTINGS = '@publicSite/SET_SITE_SETTINGS';

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
  }
}

export function setPage(page) {
  return {
    type: SET_PAGE,
    page
  }
}

export function setMeta(meta) {
  return {
    type: SET_META,
    meta
  }
}
