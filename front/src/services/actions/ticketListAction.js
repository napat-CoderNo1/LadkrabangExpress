import ActionTypes from "../constants/actionTypes";

const setTicketList = (ticket) => {
  return {
    type: ActionTypes.SET_TICKETLIST,
    payload: ticket,
  };
};

export default setTicketList;
