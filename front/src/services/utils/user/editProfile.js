import axios from "axios";

const editProfile = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/user/edit`;

  const res = await axios.post(url, {
    token: JSON.parse(localStorage.getItem("user")).token,
    firstname: info.fname
      ? info.fname
      : JSON.parse(localStorage.getItem("user")).fname,
    lastname: info.lname
      ? info.lname
      : JSON.parse(localStorage.getItem("user")).lname,
    username: info.uname
      ? info.uname
      : JSON.parse(localStorage.getItem("user")).uname,
    email: info.email
      ? info.email
      : JSON.parse(localStorage.getItem("user")).email,
  });

  return res;
};

export default editProfile;
