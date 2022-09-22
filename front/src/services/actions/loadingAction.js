import ActionTypes from "../constants/actionTypes";

const setLoading = (bool) => {
  return {
    type: ActionTypes.SET_LOADING,
    payload: bool,
  };
};

export default setLoading;
