import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./style.scss";
import {
  BsLaptopFill,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
} from "react-icons/bs";

const SeatPicker = ({
  seats,
  amount,
  setFinalSeats,
  setSeatSelected,
  disabled,
}) => {
  const lang = useSelector((state) => state.lang);
  const content =
    lang === "th"
      ? require("../../assets/jsons/booking/th.json")
      : require("../../assets/jsons/booking/en.json");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let temp = Array(Math.abs(selectedSeats.length - amount)).fill("Cx—xx");
    setFinalSeats(selectedSeats.concat(temp));
    setSeatSelected(selectedSeats.length > 0);
    if (selectedSeats.length === amount)
      document.querySelectorAll(".seat-picker__seat").forEach((e) => {
        if (
          !e.classList.contains("selected") &&
          !e.classList.contains("occupied")
        )
          e.classList.toggle("obsolete");
      });
    else
      document.querySelectorAll(".seat-picker__seat").forEach((e) => {
        if (e.classList.contains("obsolete")) e.classList.toggle("obsolete");
      });
  }, [selectedSeats]);

  useEffect(() => {
    if (document.querySelector(".seat-picker").classList.contains("disabled")) {
      document.querySelectorAll(".seat-picker__seat").forEach((e) => {
        if (
          e.classList.contains("selected") &&
          !e.classList.contains("showcase")
        ) {
          e.classList.toggle("selected");
          setSelectedSeats([]);
        }
      });
    }
  }, [disabled]);

  const handleOnSelect = ({ currentTarget: e }) => {
    if (!disabled) {
      if (selectedSeats.length < amount) {
        if (
          !e.classList.contains("occupied") &&
          !e.classList.contains("showcase")
        ) {
          e.classList.toggle("selected");
        }
        if (e.classList.contains("selected")) {
          setSelectedSeats([...selectedSeats, e.id]);
        } else setSelectedSeats(selectedSeats.filter((i) => i != e.id));
      } else {
        if (e.classList.contains("selected")) {
          e.classList.toggle("selected");
          setSelectedSeats(selectedSeats.filter((i) => i != e.id));
        }
      }
    }
  };

  return (
    <fieldset className={`seat-picker${disabled ? " disabled" : ""}`}>
      <legend align="right">
        {content.seat.legend.main}
        {selectedSeats.length}
        {content.seat.legend.of}
        {amount}
      </legend>
      <div className="seat-picker__container">
        <div className="seat-picker__overflow">
          <div className="seat-picker__coach-index">
            {content.seat.coachNo + page}
          </div>
          {seats.map((_, i) => (
            <input
              type="radio"
              name="slider"
              id={`slide${i + 1}`}
              value={i + 1}
              checked={page == i + 1}
              onChange={({ currentTarget: e }) => setPage(e.value)}
              disabled={disabled ? "disabled" : ""}
            />
          ))}
          <div className="seat-picker__inner">
            {seats.map((data) => (
              <div className="seat-picker__coach">
                {Array.from({ length: 16 }, (_, j) => (
                  <div className={`seat-picker__row-${j + 1}`}>
                    {Array.from({ length: 4 }, (_, k) => (
                      <>
                        <div
                          className={`seat-picker__seat${
                            data.seat[4 * j + k].isReserv != ""
                              ? " occupied"
                              : ""
                          }`}
                          id={
                            "CH" +
                            data.coach +
                            "—" +
                            String.fromCharCode(k + 65) +
                            (j + 1)
                          }
                          onClick={handleOnSelect}
                        >
                          <BsLaptopFill />
                        </div>
                      </>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="seat-picker__control">
            <button
              onClick={() =>
                setPage(page - 1 > 0 ? page - 1 : page + seats.length - 1)
              }
              disabled={disabled ? "disabled" : ""}
            >
              <BsFillCaretLeftFill />
            </button>
            <button
              onClick={() =>
                setPage(
                  page + 1 <= seats.length ? page + 1 : page - seats.length + 1
                )
              }
              disabled={disabled ? "disabled" : ""}
            >
              <BsFillCaretRightFill />
            </button>
            <div className="seat-picker__control__bullets">
              {seats.map((_, i) => (
                <label htmlFor={`slide${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="seat-picker__footer">
          <div className="seat-picker__seat-index">
            {selectedSeats.length != 0
              ? content.seat.selectedSeats + selectedSeats.join(",  ")
              : ""}
          </div>
          <ul className="seat-picker__showcase">
            <li>
              <div className="seat-picker__seat showcase">
                <BsLaptopFill />
                {content.seat.showcase.avail}
              </div>
            </li>
            <li>
              <div className="seat-picker__seat showcase occupied">
                <BsLaptopFill />
                {content.seat.showcase.occup}
              </div>
            </li>
            <li>
              <div className="seat-picker__seat showcase selected">
                <BsLaptopFill />
                {content.seat.showcase.seled}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </fieldset>
  );
};

export default SeatPicker;
