import changePassword from "./changePassword";
import confirmPassword from "./confirmPassword";
import editProfile from "./editProfile";
import fetchProfile from "./fetchProfile";
import forgot from "./forgot";

const userServices = {
  fetchProfile,
  editProfile,
  forgot,
  changePassword,
  confirmPassword,
};

export default userServices;
