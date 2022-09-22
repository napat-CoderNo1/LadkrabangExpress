import axios from "axios";

const acceptRefund = async (id) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/staff/acceptRefund`;

  const res = await axios.post(url, {
    refundID: id,
  });

  return res.data;
};

export default acceptRefund;
