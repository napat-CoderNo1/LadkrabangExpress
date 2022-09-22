import axios from "axios";

const refund = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/refund`;

  const res = await axios.post(url, {
    token: info.token,
    ticketID: info.id,
    reason: info.reason,
  });

  console.log(res);

  return res.status;
};

export default refund;
