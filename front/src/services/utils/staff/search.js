import axios from "axios";
import logServices from "../log";

const search = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/staff/search`;

  const res = await axios.post(url, {
    token: logServices.isLogged().token,
    trainNumber: info.trainNumber,
    date: info.date,
    class: info.class,
  });
  console.log(res);
  if (res.data && res.data.length > 0) return res.data;
  else return 204;
};

export default search;
