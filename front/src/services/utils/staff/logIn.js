import axios from "axios";

const logIn = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/staff/login`;

  const res = await axios.post(url, {
    username: info.uname,
    password: info.pword,
    isStaff: true,
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
      isStaff: true,
    })
  );

  return res.status;
};

export default logIn;
