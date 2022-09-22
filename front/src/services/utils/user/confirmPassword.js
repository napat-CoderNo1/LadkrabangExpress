import axios from "axios";

const confirmPassword = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/user/confirmPassword`;

  const res = await axios.post(url, {
    token: info.token,
    password: info.pword,
  });

  

  return res.status;
};

export default confirmPassword;
