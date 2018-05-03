const initialState = { user: {} };

export const SET_ENV_VARS = '@env/SET_VARS';

export function setEnvVars() {
  const { global } = window.gon;

  return {
    type: SET_ENV_VARS,
    payload: {
      apiUrl: global.api_url,
      apiEnv: global.api_env,
      apiApplications: global.api_applications,
      controlTowerUrl: global.control_tower_url,
      user: global.user,
      admin: global.admin
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
