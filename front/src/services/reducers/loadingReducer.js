import ActionTypes from "../constants/actionTypes";
import InitialStates from "../constants/initialStates";

const loadingReducer = (state = InitialStates.LOADING, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_LOADING:
      return (state = payload);
    default:
      return state;
  }
};

export default loadingReducer;
