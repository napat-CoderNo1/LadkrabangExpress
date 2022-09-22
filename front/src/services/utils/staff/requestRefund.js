import axios from "axios";
import logServices from "../log";

const refund = async () => {
  const port = 5000;
  const url = `http://localhost:${port}/api/staff/refund`;

  const res = await axios.post(url, {
    token: logServices.isLogged().token,
  });

  return res.data;
};

export default refund;
