import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useNavigate,
  createSearchParams,
  useSearchParams,
} from "react-router-dom";
import "./style.scss";
import actions from "../../services/actions";
import bookingServices from "../../services/utils/booking";
import logServices from "../../services/utils/log";

const BookingForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const lang = useSelector((state) => state.lang);
  const params = new URLSearchParams(location.search);
  const stations = require("../../assets/jsons/booking/stations.json");
  const content =
    lang === "th"
      ? require("../../assets/jsons/booking/th.json")
      : require("../../assets/jsons/booking/en.json");
  const [searchParams, _] = useSearchParams();
  const [err, setErr] = useState(false);
  const [routeErr, setRouteErr] = useState(false);
  const [missingInput, setMissingInput] = useState(false);
  const [earlyReturn, setEarlyReturn] = useState(false);
  const [incorrectStations, setIncorrectStations] = useState(false);
  const [matchedStations, setMatchedStations] = useState(false);
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [pax, setPax] = useState("");
  const [curDate, setCurDate] = useState({
    value: "",
    temp: "",
    onFocus: false,
  });
  const [curTime, setCurTime] = useState({
    value: "",
    temp: "",
    onFocus: false,
  });

  useEffect(() => {
    let min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    let max = new Date();
    max.setDate(max.getDate() + 30);
    max = max.toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", min);
    document.getElementById("date").setAttribute("max", max);
    setOrigin(searchParams.get("from"));
    setDest(params.get("to") ? params.get("to") : "");
    setPax(params.get("pax") ? params.get("pax") : "");
    setRouteErr(sessionStorage.getItem("routeError") == 1);
    setCurDate({ value: params.get("date"), onFocus: true });
    setCurTime({ value: params.get("time"), onFocus: true });
    sessionStorage.removeItem("trainList");
    sessionStorage.removeItem("seatList");
  }, []);

  useEffect(() => {
    setErr(routeErr);
  }, [routeErr]);

  useEffect(() => {
    if (origin !== "" || dest !== "") {
      if (lang === "th") {
        for (const i of stations) {
          if (origin === i["en"]) {
            setOrigin(i["th"]);
          }
          if (dest === i["en"]) {
            setDest(i["th"]);
          }
        }
      } else {
        for (const i of stations) {
          if (origin === i["th"]) {
            setOrigin(i["en"]);
          }
          if (dest === i["th"]) {
            setDest(i["en"]);
          }
        }
      }
    }
  }, [lang]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let dt =
      curDate.value && curTime.value
        ? new Date([curDate.value, curTime.value].join(" "))
        : "";
    let missing = false;
    let matchedStations = false;
    let stationsNotExists = false;
    let dtErr = false;
    let originTH = "";
    let destTH = "";
    if (origin != "" && dest != "") {
      for (const i of stations) {
        if (
          origin.toLowerCase() === i["en"].toLowerCase() ||
          origin.toLowerCase() === i["th"].toLowerCase()
        )
          originTH = i["th"];
        if (
          dest.toLowerCase() === i["en"].toLowerCase() ||
          dest.toLowerCase() === i["th"].toLowerCase()
        )
          destTH = i["th"];
      }
    }
    if (originTH === "") originTH = "NaN";
    if (destTH === "") destTH = "NaN";
    if (dt !== "") {
      if (
        dt < new Date() ||
        dt > new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 30)
      )
        dtErr = true;
      else dtErr = false;
    } else {
      dtErr = true;
      missing = true;
    }
    const info = {
      from: originTH,
      to: destTH,
      pax: pax,
      date: curDate.value,
      time: curTime.value,
    };
    for (const key in info)
      if (info[key] == "" || info[key] == null) missing = true;
    if (info.from === info.to) matchedStations = true;
    else matchedStations = false;
    if (info.from === "NaN" || info.to === "NaN") stationsNotExists = true;
    else stationsNotExists = false;

    if (missing || matchedStations || stationsNotExists || dtErr) {
      setErr(true);
      if (missing) setMissingInput(true);
      else setMissingInput(false);
      if (matchedStations) setMatchedStations(true);
      else setMatchedStations(false);
      if (stationsNotExists) setIncorrectStations(true);
      else setIncorrectStations(false);
      if (dtErr) setEarlyReturn(true);
      else setEarlyReturn(false);
    } else {
      setErr(false);
      try {
        dispatch(actions.setLoading(true));
        const res = await bookingServices.findTrains(info);
        if (res === 200) {
          if (logServices.isLogged()) {
            navigate({
              pathname: "1",
              search: createSearchParams({
                from: originTH,
                to: destTH,
                date: curDate.value,
                time: curTime.value,
                pax: pax,
              }).toString(),
            });
          } else {
            navigate({
              pathname: "/login",
              search: createSearchParams({
                from: originTH,
                to: destTH,
                date: curDate.value,
                time: curTime.value,
                pax: pax,
              }).toString(),
            });
          }
        } else {
          setErr(true);
          sessionStorage.setItem("routeError", 1);
          dispatch(actions.setLoading(false));
        }
      } catch (er) {
        dispatch(actions.setLoading(false));
        console.log(er);
      }
    }
  };

  return (
    <form className="booking-form" onSubmit={handleOnSubmit}>
      <fieldset className="booking-form__container">
        <legend align="center">{content.form.header}</legend>
        <div className="booking-form__form">
          {err && (
            <div className="booking-form__form__errors">
              {missingInput
                ? content.form.errors.missingInput
                : matchedStations
                ? content.form.errors.invalidStations
                : incorrectStations
                ? content.form.errors.invalidStations
                : earlyReturn
                ? content.form.errors.earlyReturn
                : !!routeErr
                ? content.form.errors.routeErr
                : ""}
            </div>
          )}
          <div className="booking-form__form__first-row">
            <div className="booking-form__form__50">
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
                placeholder=" "
                autoComplete="off"
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
              <label htmlFor="from">
                {content.form.fields.origin} <span>*</span>
              </label>
            </div>
            <div className="booking-form__form__50">
              <input
                type="text"
                id="to"
                list="destination"
                value={dest}
                onInput={({ currentTarget: input }) => {
                  let ops = document.getElementById("destination").childNodes;
                  for (let i = 0; i < ops.length; i++) {
                    if (ops[i].value === input.value) {
                      setDest(ops[i].value);
                      break;
                    }
                  }
                }}
                onChange={({ currentTarget: input }) => setDest(input.value)}
                placeholder=" "
                autoComplete="off"
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
              <label htmlFor="to">
                {content.form.fields.destination} <span>*</span>
              </label>
            </div>
          </div>
          <div className="booking-form__form__second-row">
            <div className="booking-form__form__second-row__group">
              <div className="booking-form__form__100">
                <input
                  type="text"
                  id="date"
                  value={curDate.onFocus ? curDate.value : curDate.temp}
                  onChange={({ currentTarget: input }) =>
                    setCurDate({ value: input.value })
                  }
                  onFocus={({ currentTarget: input }) => {
                    input.type = "date";
                    if (input.value !== "") {
                      let valArr = String(input.value).split("-");
                      let val = valArr[1] + "/" + valArr[2] + "/" + valArr[0];
                      input.value = val;
                      setCurDate({ temp: val });
                    }
                    setCurDate({ ...curDate, onFocus: true });
                  }}
                  onBlur={({ currentTarget: input }) => {
                    input.type = "text";
                    if (input.value !== "") {
                      let valArr = String(input.value).split("-");
                      let val = valArr[1] + "/" + valArr[2] + "/" + valArr[0];
                      input.value = val;
                      setCurDate({ value: val });
                    }
                    setCurDate({ ...curDate, onFocus: false });
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  placeholder=" "
                  autoComplete="off"
                />
                <label htmlFor="date">
                  {content.form.fields.date} <span>*</span>
                </label>
              </div>
            </div>
            <div className="booking-form__form__second-row__group">
              <div className="booking-form__form__50">
                <input
                  type="text"
                  id="time"
                  value={curTime.onFocus ? curTime.value : curTime.temp}
                  onChange={({ currentTarget: input }) =>
                    setCurTime({ value: input.value })
                  }
                  onFocus={({ currentTarget: input }) => {
                    input.type = "time";
                    if (input.value !== "") {
                      let valArr = String(input.value).split(":");
                      let hour = 0;
                      let AMPM = "AM";
                      Number(valArr[0]) >= 12 ? (AMPM = "PM") : (AMPM = "AM");
                      hour = Number(valArr[0]) % 12 || 12;
                      hour = hour < 10 ? "0" + String(hour) : String(hour);
                      let val = hour + ":" + valArr[1] + " " + AMPM;
                      input.value = val;
                      setCurTime({ temp: val });
                    }
                    setCurTime({ ...curTime, onFocus: true });
                  }}
                  onBlur={({ currentTarget: input }) => {
                    input.type = "text";
                    if (input.value !== "") {
                      let valArr = String(input.value).split(":");
                      let hour = 0;
                      let AMPM = "AM";
                      Number(valArr[0]) >= 12 ? (AMPM = "PM") : (AMPM = "AM");
                      hour = Number(valArr[0]) % 12 || 12;
                      hour = hour < 10 ? "0" + String(hour) : String(hour);
                      let val = hour + ":" + valArr[1] + " " + AMPM;
                      input.value = val;
                      setCurTime({ value: val });
                    }
                    setCurTime({ ...curTime, onFocus: false });
                  }}
                  placeholder=" "
                  autoComplete="off"
                />
                <label htmlFor="time">
                  {content.form.fields.time} <span>*</span>
                </label>
              </div>
              <div className="booking-form__form__50">
                <input
                  type="number"
                  id="pax"
                  min="1"
                  max="10"
                  step="1"
                  value={pax}
                  onChange={({ currentTarget: input }) => setPax(input.value)}
                  placeholder=" "
                  autoComplete="off"
                />
                <label htmlFor="pax">
                  {content.form.fields.passengers} <span>*</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          className="booking-form__btn"
          value={content.form.buttons.continue}
        />
      </fieldset>
    </form>
  );
};

export default BookingForm;
