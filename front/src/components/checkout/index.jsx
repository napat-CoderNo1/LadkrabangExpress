import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./style.scss";
import visaMastercard from "../../assets/icons/visa-mastercard.png";
import BookingButtons from "../bookingBtns";
import Ticket from "../ticket";
import logServices from "../../services/utils/log";
import bookingServices from "../../services/utils/booking";
import actions from "../../services/actions";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const [searchParams, _] = useSearchParams({});
  const content =
    lang === "th"
      ? require("../../assets/jsons/booking/th.json")
      : require("../../assets/jsons/booking/en.json");
  const [tickets, setTickets] = useState({});
  const [displayTickets, setDisplayTickets] = useState([]);
  const [err, setErr] = useState(true);
  const [totalPrice, setTotalPrice] = useState(-1);
  const [payment, setPayment] = useState({
    name: "",
    num: "",
    exp: "",
    cvc: "",
  });

  useEffect(() => {
    setTickets(JSON.parse(searchParams.get("tkt")));
  }, []);

  useEffect(() => {
    try {
      console.log(tickets);
      let common = {
        trainNumber: tickets.t_n,
        date: tickets.dt,
        origin: tickets.or,
        destination: tickets.des,
        passenger: tickets.pax,
        reservation_class: tickets.r_c,
        departureTime: tickets.d_t,
        arrivalTime: tickets.a_t,
        duration: tickets.d,
        ticketPrice: totalPrice > 0 ? totalPrice : tickets.tp,
      };
      let seats = [...tickets.s];
      let newTickets = new Array();
      Array.from({ length: seats.length }, (_, i) => {
        newTickets[i] = {
          ...common,
          eaTicketPrice:
            seats[i].coach === 0
              ? Number(tickets.tp)
              : Number(tickets.tp) + 10,
          seat_reservation: {
            coach: seats[i].coach === 0 ? "-" : seats[i].coach,
            row: seats[i].row === 0 ? "-" : seats[i].row,
            column: seats[i].column,
          },
        };
      });
      newTickets[0] = { ...newTickets[0], food_reservation: tickets.f_r };
      console.log(newTickets);
      setDisplayTickets(newTickets);
    } catch {}
  }, [tickets, totalPrice]);

  useEffect(() => {
    try {
      let sum = 0;
      displayTickets.map((dt) => {
        sum += Number(dt.eaTicketPrice);
      });
      setTotalPrice(sum);
    } catch {}
  }, [displayTickets]);

  useEffect(() => {
    if (
      payment.name !== "" &&
      payment.num !== "" &&
      payment.exp !== "" &&
      payment.cvc !== ""
    ) {
      setErr(false);
    } else setErr(true);
  }, [payment]);

  const handleInputOnChange = ({ currentTarget: input }) => {
    const temp = { ...payment };
    temp[input.id] = input.value;
    setPayment(temp);
  };

  const handleOnNext = async (e) => {
    e.preventDefault();
    const info = {
      ...tickets,
      token: JSON.parse(localStorage.getItem("user")).token,
      user_id: JSON.parse(localStorage.getItem("user")).id,
      train_id: tickets.t_id,
    };
    console.log(info);
    try {
      dispatch(actions.setLoading(true));
      await bookingServices.submitTicket(info);
      navigate("/profile");
    } catch (er) {
      dispatch(actions.setLoading(false));
      console.log(er);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__container">
        <div className="checkout__content">
          <div className="checkout__ticket">
            {displayTickets.map((ticket) => (
              <Ticket ticket={ticket} />
            ))}
          </div>
          <fieldset>
            <legend align="center">{content.checkout.header}</legend>
            <form className="checkout__payment">
              <img src={visaMastercard} alt="" />
              <div className="checkout__payment__100">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={payment.name}
                  onChange={handleInputOnChange}
                  autoComplete="off"
                  placeholder=" "
                />
                <label htmlFor="name">
                  {content.checkout.name} <span>*</span>
                </label>
              </div>
              <div className="checkout__payment__100">
                <input
                  type="tel"
                  id="num"
                  name="num"
                  value={payment.num}
                  onChange={handleInputOnChange}
                  onKeyUp={({ currentTarget: input }) => {
                    let formatted = input.value.replace(/[^\d]/g, "");
                    formatted = formatted.substring(0, 16);
                    let section = formatted.match(/\d{1,4}/g);
                    if (section !== null) formatted = section.join(" ");
                    if (input.value !== formatted) input.value = formatted;
                  }}
                  maxLength="19"
                  autoComplete="off"
                  placeholder=" "
                />
                <label htmlFor="num">
                  {content.checkout.num} <span>*</span>
                </label>
              </div>
              <div className="checkout__payment__group">
                <div className="checkout__payment__50">
                  <input
                    type="text"
                    id="exp"
                    name="exp"
                    value={payment.exp}
                    onChange={handleInputOnChange}
                    onKeyUp={(e) => {
                      let code = e.keyCode;
                      let allowedKeys = [8];
                      if (allowedKeys.indexOf(code) !== -1) return;
                      e.target.value = e.target.value
                        .replace(/^([1-9]\/|[2-9])$/g, "0$1/")
                        .replace(/^(0[1-9]|1[0-2])$/g, "$1/")
                        .replace(/^([0-1])([3-9])$/g, "0$1/$2")
                        .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, "$1/$2")
                        .replace(/^([0]+)\/|[0]+$/g, "0")
                        .replace(/[^\d\/]|^[\/]*$/g, "")
                        .replace(/\/\//g, "/");
                    }}
                    maxLength="5"
                    autoComplete="off"
                    placeholder=" "
                  />
                  <label htmlFor="exp">
                    {content.checkout.exp} <span>*</span>
                  </label>
                </div>
                <div className="checkout__payment__50">
                  <input
                    type="password"
                    id="cvc"
                    name="cvc"
                    value={payment.cvc}
                    onChange={handleInputOnChange}
                    maxLength="3"
                    autoComplete="off"
                    placeholder=" "
                  />
                  <label htmlFor="cvc">
                    {content.checkout.cvc} <span>*</span>
                  </label>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
        <BookingButtons
          onNext={handleOnNext}
          price={searchParams.get("_price")}
          disabled={err}
          page={5}
          pastUrlParams={searchParams.toString().split(".00000")[0]}
        />
      </div>
    </div>
  );
};

export default Checkout;
