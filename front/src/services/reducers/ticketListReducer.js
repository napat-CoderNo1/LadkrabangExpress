import ActionTypes from "../constants/actionTypes";
import InitialStates from "../constants/initialStates";

const ticketListReducer = (state = InitialStates.TICKETLIST, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_TICKETLIST:
      return (state = payload);
    default:
      return state;
  }
};

export default ticketListReducer;
