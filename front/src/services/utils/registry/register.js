import axios from "axios";

const register = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/register`;

  const res = await axios.post(url, {
    firstname: info.fname,
    lastname: info.lname,
    email: info.email,
    username: info.uname,
    password: info.pword,
  });

  return res.status;
};

export default register;
