import ActionTypes from "../constants/actionTypes";

const setTheme = (theme) => {
  return {
    type: ActionTypes.SET_THEME,
    payload: theme,
  };
};

export default setTheme;
