import axios from "axios";

const findTrains = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/booking`;

  const res = await axios.post(url, {
    origin: info.from,
    destination: info.to,
    date: info.date,
    time: info.time,
    passenger: info.pax,
    // dateReturn: info.returnDate,
    // timeReturn: info.returnTime,
  });

  if (res.data.length > 0) {
    sessionStorage.setItem("trainList", JSON.stringify(res.data));
    return 200;
  } else {
    return 204;
  }
};

export default findTrains;
