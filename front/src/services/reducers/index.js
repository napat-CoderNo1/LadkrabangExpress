import { combineReducers } from "redux";
import languageReducer from "./languageReducer";
import themeReducer from "./themeReducer";
import loadingReducer from "./loadingReducer";
import trainListReducer from "./trainListReducer";
import seatListReducer from "./seatListReducer";
import ticketListReducer from "./ticketListReducer";

const reducers = combineReducers({
  theme: themeReducer,
  lang: languageReducer,
  loading: loadingReducer,
  trains: trainListReducer,
  seats: seatListReducer,
  tickets: ticketListReducer,
});

export default reducers;
