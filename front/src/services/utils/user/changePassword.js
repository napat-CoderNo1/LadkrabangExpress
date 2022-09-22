import axios from "axios";

const changePassword = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/user/changePassword`;

  const res = await axios.post(url, {
    token: info.token,
    password: info.pword,
  });

  console.log(res);

  return res.status;
};

export default changePassword;
