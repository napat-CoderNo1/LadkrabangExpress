import ActionTypes from "../constants/actionTypes";
import InitialStates from "../constants/initialStates";

const seatListReducer = (
  state = InitialStates.SEATLIST,
  { type, payload }
) => {
  switch (type) {
    case ActionTypes.SET_SEATLIST:
      return (state = payload);
    default:
      return state;
  }
};

export default seatListReducer;
