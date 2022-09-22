import axios from "axios";

const register = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/staff/register`;

  const res = await axios.post(url, {
    firstname: info.fname,
    lastname: info.lname,
    email: info.email,
    username: info.uname,
    password: info.pword,
    isStaff: true,
  });

  return res.status;
};

export default register;
