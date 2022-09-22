import ActionTypes from "../constants/actionTypes";

const setSeatList = (seatList) => {
  return {
    type: ActionTypes.SET_SEATLIST,
    payload: seatList,
  };
};

export default setSeatList;
