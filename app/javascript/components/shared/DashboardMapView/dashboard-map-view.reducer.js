export const SET_SQL_WHERE = 'DASHBORD_MAP_VIEW/SET_SQL_WHERE';

const initialState = {
  sqlWhere: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SQL_WHERE:
      return Object.assign({}, state, { sqlWhere: action.payload });

    default:
      return state;
  }
};
