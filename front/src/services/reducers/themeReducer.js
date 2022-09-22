import ActionTypes from "../constants/actionTypes";
import InitialStates from "../constants/initialStates";

const themeReducer = (state = InitialStates.THEME, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_THEME:
      return (state = payload);
    default:
      return state;
  }
};

export default themeReducer;
