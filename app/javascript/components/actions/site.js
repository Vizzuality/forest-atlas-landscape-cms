export const SET_SITE = 'SET_SITE';
export const SET_PAGE = 'SET_PAGE';
export const SET_META = 'SET_META';

export function setSite(current) {
  return {
    type: SET_SITE,
    current
  };
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
