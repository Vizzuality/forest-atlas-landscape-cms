const initialState = { user: {} };

export const SET_ENV_VARS = '@env/SET_VARS';

export function setEnvVars() {
  const { global } = window.gon;

  return {
    type: SET_ENV_VARS,
    payload: {
      apiUrl: global.apiUrl,
      apiEnv: global.apiEnv,
      apiApplications: global.apiApplications,
      controlTowerUrl: global.controlTowerUrl,
      user: global.user
    }
  };
}


export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ENV_VARS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
