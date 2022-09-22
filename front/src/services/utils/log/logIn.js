import axios from "axios";

const logIn = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/login`;

  const res = await axios.post(url, {
    username: info.uname,
    password: info.pword,
  });

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: res.data._id,
      token: res.data.token,
      fname: res.data.firstname,
      lname: res.data.lastname,
      email: res.data.email,
      uname: res.data.username,
      isStaff: false,
    })
  );

  return res.status;
};

export default logIn;
