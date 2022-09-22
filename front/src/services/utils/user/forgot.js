import axios from "axios";

const forgot = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/user/forgot`;

  const res = await axios.post(url, {
    email: info,
  });

  if (res.status === 200) return res.data;
  else return res.status
};

export default forgot;
