import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./style.scss";
import QRCode from "qrcode";
import { AiFillPrinter } from "react-icons/ai";
import NavBar from "../../../components/navbar";
import Ticket from "../../../components/ticket";
import TicketPDF from "../../../components/pdf";
import { useSelector } from "react-redux";

const DisplayBookingTicket = () => {
  const params = useParams();
  const lang = useSelector((state) => state.lang);
  const ref = useRef();
  const serverDomainName = "http://localhost:5000";
  const [qr, setQr] = useState("");
  const [tickets, setTickets] = useState([]);
  const [displayTickets, setDisplayTickets] = useState([]);

  useEffect(() => {
    document.title = "Ticket - LKBX";
    QRCode.toDataURL(serverDomainName + "/api/staff/showTicket/" + params.id, {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#1B1A19",
        light: "#fff",
      },
    }).then((data) => setQr(data));

    JSON.parse(sessionStorage.getItem("ticketList")).map((booking) => {
      if (params.id === booking._id) {
        setTickets(booking);
      }
    });
  }, []);

  useEffect(() => {
    try {
      let common = {
        trainNumber: tickets.train_number,
        date: tickets.date,
        origin: tickets.origin,
        destination: tickets.destination,
        passenger: tickets.passenger,
        reservation_class: tickets.reservation_class,
        departureTime: tickets.departureTime,
        arrivalTime: tickets.arrivalTime,
        duration: tickets.duration,
        totalPrice: tickets.total_price,
      };
      let seats = [...tickets.seat_reservation];
      let newTickets = new Array();
      Array.from({ length: seats.length }, (_, i) => {
        newTickets[i] = {
          ...common,
          eaTicketPrice: !seats[i].coach
            ? Number(tickets.ticketPrice)
            : Number(tickets.ticketPrice) + Number(tickets.reservation_price),
          seat_reservation: {
            coach: seats[i].coach ? seats[i].coach : "-",
            row: seats[i].row ? seats[i].row : "-",
            column: seats[i].column ? seats[i].column : "",
          },
        };
      });
      newTickets[0] = {
        ...newTickets[0],
        food_reservation: tickets.food_reservation,
      };
      setDisplayTickets(newTickets);
    } catch {}
  }, [tickets]);

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <>
      <NavBar />
      <div className="display-ticket">
        <div className="display-ticket__container">
          <div className="display-ticket__header">
            <div>
              <Link to="refund">
                {lang === "th" ? "ยกเลิกการจอง" : "Request refund"}
              </Link>
            </div>
            <Link to="/profile">
              <h1>
                {lang === "th" ? "ขอให้เดินทางโดยสวัสดิภาพ!" : "Bon Voyage!"}
              </h1>
            </Link>
            <div>
              <button onClick={handlePrint}>
                <AiFillPrinter />
              </button>
            </div>
          </div>
          <div className="display-ticket__content">
            <div className="display-ticket__qr">
              <img src={qr} alt="" />
            </div>
            <div className="display-ticket__tickets">
              {displayTickets.map((ticket) => (
                <Ticket ticket={ticket} />
              ))}
            </div>
          </div>
        </div>
        <TicketPDF ref={ref} QR={qr} tickets={displayTickets} />
      </div>
    </>
  );
};

export default DisplayBookingTicket;
