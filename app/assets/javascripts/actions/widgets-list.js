export const INIT = 'INIT';
export const LOADING = 'LOADING';

export function init() {
  return function (dispatch) {
    $.get('http://ec2-52-23-163-254.compute-1.amazonaws.com/widgets')
      .then((data) => {
        dispatch({
          type: INIT,
          payload: {
            data: data
          }
        });
        dispatch({
          type: LOADING,
          payload: false
        });
      });
  };
}
