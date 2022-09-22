import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import icon from "../../assets/icons/icon.png";
import { MdMyLocation, MdLocationOn, MdAccessTime } from "react-icons/md";

const TicketPDF = React.forwardRef(({ QR, tickets, disabled }, ref) => {
  const lang = useSelector((state) => state.lang);
  const stations = require("../../assets/jsons/booking/stations.json");
  const content =
    lang === "th"
      ? require("../../assets/jsons/ticket/th.json")
      : require("../../assets/jsons/ticket/en.json");
  const [ticketList, setTicketList] = useState([]);
  const [common, setCommon] = useState({});
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    try {
      setTicketList(tickets);
    } catch {}
  }, [tickets]);

  useEffect(() => {
    try {
      let temp = [];
      ticketList.map((t) => {
        temp.push({
          coach: t.seat_reservation.coach,
          row: t.seat_reservation.row,
          column: t.seat_reservation.column,
          price: t.eaTicketPrice,
        });
      });
      setSeats(temp);
    } catch {}
  }, [ticketList]);

  useEffect(() => {
    try {
      console.log(seats);
      setCommon({
        origin: ticketList[0].origin,
        destination: ticketList[0].destination,
        trainNumber: ticketList[0].trainNumber,
        date: ticketList[0].date,
        price: ticketList[0].totalPrice,
        depTime: ticketList[0].departureTime,
        arrTime: ticketList[0].arrivalTime,
        duration: ticketList[0].duration,
        class: ticketList[0].reservation_class,
      });
    } catch {}
  }, [seats]);

  const showStation = (data) => {
    let res = "";
    try {
      if (lang === "th") res = data;
      else {
        for (const i of stations) if (data === i["th"]) res = i["en"];
      }
    } catch {}
    return res;
  };

  return (
    <div ref={ref} className={`pdf${disabled ? " disabled" : ""}`}>
      <div className="pdf__container">
        <img src={icon} alt="" />
        <img src={QR} alt="" />
        <h3 className="pdf__name">
          {JSON.parse(localStorage.getItem("user")).fname +
            " " +
            JSON.parse(localStorage.getItem("user")).lname}
        </h3>
        <div className="pdf__tickets">
          <div className="pdf__tickets__common">
            <div className="pdf__tickets__common__first-row">
              <MdMyLocation />
              &ensp;{showStation(common.origin)}&ensp;&ensp;&ensp;
              <MdLocationOn />
              &ensp;{showStation(common.destination)}&ensp;&ensp;&ensp;
              <MdAccessTime />
              &ensp;
              {new Date(common.date).toLocaleString(lang, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <br />
            <div className="pdf__tickets__common__second-row">
              <span>
                {content.trainNo}&ensp;:&ensp;
                {common.trainNumber}
              </span>
              &ensp;&ensp;
              <span>
                {content.class}&ensp;:&ensp;
                {common.class}
              </span>
              &ensp;&ensp;
              <span>
                {content.price}&ensp;:&ensp;
                {common.price}
              </span>
            </div>
            <div className="pdf__tickets__common__third-row">
              <span>
                {content.depTime.full}&ensp;:&ensp;
                {common.depTime}
              </span>
              &ensp;&ensp;
              <span>
                {content.arrTime.full}&ensp;:&ensp;
                {common.arrTime}
              </span>
              &ensp;&ensp;
              <span>
                {content.duration}&ensp;:&ensp;
                {common.duration}
              </span>
            </div>
          </div>
          <br />
          <table className="pdf__tickets__seats">
            <thead>
              <tr>
                <th>{content.coach}</th>
                <th>{content.row}</th>
                <th>{content.column}</th>
                <th>{content.price}</th>
              </tr>
            </thead>
            <tbody>
              {seats
                ? seats.map((seat) => (
                    <tr>
                      <td>{seat.coach}</td>
                      <td>{seat.row}</td>
                      <td>{seat.column === "" ? "-" : seat.column}</td>
                      <td>{seat.price}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default TicketPDF;
