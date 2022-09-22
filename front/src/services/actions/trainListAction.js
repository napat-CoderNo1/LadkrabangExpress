import ActionTypes from "../constants/actionTypes";

const setTrainList = (trainList) => {
  return {
    type: ActionTypes.SET_TRAINLIST,
    payload: trainList,
  };
};

export default setTrainList;
