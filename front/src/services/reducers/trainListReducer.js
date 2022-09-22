import ActionTypes from "../constants/actionTypes";
import InitialStates from "../constants/initialStates";

const trainListReducer = (state = InitialStates.TRAINLIST, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_TRAINLIST:
      return (state = payload);
    default:
      return state;
  }
};

export default trainListReducer;
