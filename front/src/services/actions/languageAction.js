import ActionTypes from "../constants/actionTypes";

const setLanguage = (lang) => {
  return {
    type: ActionTypes.SET_LANGUAGE,
    payload: lang,
  };
};

export default setLanguage;
