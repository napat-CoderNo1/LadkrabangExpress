import axios from "axios";

const submitTicket = async (info) => {
  const port = 5000;
  const url = `http://localhost:${port}/api/addTicket`;

  const res = await axios.post(url, {
    token: info.token,
    user_id: info.user_id,
    train_id: info.train_id,
    date: info.dt,
    origin: info.or,
    destination: info.des,
    passenger: info.pax,
    reservation_class: info.r_c,
    departureTime: info.d_t,
    arrivalTime: info.a_t,
    seat_reservation: info.s,
    food_reservation: info.f_r
  });

  console.log(res.data);
};

export default submitTicket;
