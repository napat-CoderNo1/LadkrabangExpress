import logIn from "./logIn";
import refund from "./requestRefund";
import register from "./register";
import search from "./search";
import approveRefund from "./approveRefund";

const staffServices = {
  search,
  logIn,
  register,
  refund,
  approveRefund,
};

export default staffServices;
