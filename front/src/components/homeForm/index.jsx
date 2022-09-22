import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, createSearchParams } from "react-router-dom";
import "./style.scss";

const HomeForm = () => {
  const navigate = useNavigate();
  const lang = useSelector((state) => state.lang);
  const span =
    lang === "th"
      ? {
          origin: "ต้นทาง",
          dest: "ปลายทาง",
          pax: "จำนวนผู้โดยสาร",
        }
      : {
          origin: "Origin",
          dest: "Destination",
          pax: "Passengers",
        };
  const stations = require("../../assets/jsons/booking/stations.json");
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [pax, setPax] = useState("");

  useEffect(() => {
    if (origin != "" || dest != "") {
      if (lang === "th") {
        for (const i of stations) {
          if (origin == i["en"]) {
            setOrigin(i["th"]);
          }
          if (dest == i["en"]) {
            setDest(i["th"]);
          }
        }
      } else {
        for (const i of stations) {
          if (origin == i["th"]) {
            setOrigin(i["en"]);
          }
          if (dest == i["th"]) {
            setDest(i["en"]);
          }
        }
      }
    }
  }, [lang]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (origin == "" && dest == "" && pax == "") {
      navigate("booking");
    } else {
      navigate({
        pathname: "booking",
        search: createSearchParams({
          from: origin,
          to: dest,
          pax: pax,
        }).toString(),
      });
    }
  };

  return (
    <form className="home-form" onSubmit={handleOnSubmit}>
      <div className="home-form__form">
        <div className="home-form__form__item">
          <label>
            <span>{span.origin}</span>
            <input
              type="text"
              id="from"
              list="origin"
              value={origin}
              onInput={({ currentTarget: input }) => {
                let opts = document.getElementById("origin").childNodes;
                for (let i = 0; i < opts.length; i++) {
                  if (opts[i].value === input.value) {
                    setOrigin(opts[i].value);
                    break;
                  }
                }
              }}
              onChange={({ currentTarget: input }) => setOrigin(input.value)}
            />
            <datalist id="origin">
              {lang === "th"
                ? stations.map((option) => (
                    <option value={option.th} key={option.en}>
                      {option.en}
                    </option>
                  ))
                : stations.map((option) => (
                    <option value={option.en} key={option.th}>
                      {option.th}
                    </option>
                  ))}
            </datalist>
          </label>
        </div>
        <div className="home-form__form__item">
          <label>
            <span>{span.dest}</span>
            <input
              type="text"
              id="to"
              list="destination"
              value={dest}
              onInput={({ currentTarget: input }) => {
                let opts = document.getElementById("destination").childNodes;
                for (let i = 0; i < opts.length; i++) {
                  if (opts[i].value === input.value) {
                    setDest(opts[i].value);
                    break;
                  }
                }
              }}
              onChange={({ currentTarget: input }) => setDest(input.value)}
            />
            <datalist id="destination">
              {lang === "th"
                ? stations.map((option) => (
                    <option value={option.th} key={option.en}>
                      {option.en}
                    </option>
                  ))
                : stations.map((option) => (
                    <option value={option.en} key={option.th}>
                      {option.th}
                    </option>
                  ))}
            </datalist>
          </label>
        </div>
        <div className="home-form__form__item">
          <label>
            <span>{span.pax}</span>
            <input
              type="number"
              min="1"
              max="10"
              step="1"
              value={pax}
              onChange={({ currentTarget: input }) => setPax(input.value)}
            />
          </label>
        </div>
      </div>
      <input type="submit" className="home-form__btn" value="▶" />
    </form>
  );
};

export default HomeForm;
