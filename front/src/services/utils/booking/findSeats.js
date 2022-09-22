import axios from "axios";

const findSeats = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/makeSeatLayout`;

  const res = await axios.post(url, {
    trainID: info.trainId,
    date: info.date,
  });

  if (res.data.length > 0) {
    sessionStorage.setItem("seatList", JSON.stringify(res.data));
    return 200;
  } else {
    return 204;
  }
};

export default findSeats;
