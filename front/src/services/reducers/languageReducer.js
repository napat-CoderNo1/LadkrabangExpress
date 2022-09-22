import ActionTypes from "../constants/actionTypes";
import InitialStates from "../constants/initialStates";

const languageReducer = (state = InitialStates.LANG, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_LANGUAGE:
      return (state = payload);
    default:
      return state;
  }
};

export default languageReducer;
