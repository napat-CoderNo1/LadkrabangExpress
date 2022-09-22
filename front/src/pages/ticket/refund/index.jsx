import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import Loading from "../../../components/loading";
import actions from "../../../services/actions";
import ticketServices from "../../../services/utils/tickets";

const Refund = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const lang = useSelector((state) => state.lang);
  const loading = useSelector((state) => state.loading);
  const content =
    lang === "th"
      ? require("../../../assets/jsons/booking/th.json")
      : require("../../../assets/jsons/booking/en.json");
  const [info, setInfo] = useState({
    name: "",
    email: "",
    reason: "",
  });

  useEffect(() => (document.title = "Refund - LKBX"), []);

  const handleInputOnChange = ({ currentTarget: e }) => {
    const temp = { ...info };
    temp[e.id] = e.value;
    setInfo(temp);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(actions.setLoading(true));
      const res = await ticketServices.refund({
        token: JSON.parse(localStorage.getItem("user")).token,
        id: params.id,
        reason: info.reason,
      });
      if (res == 200) {
        dispatch(actions.setLoading(false));
        navigate("/profile");
      }
    } catch (er) {
      dispatch(actions.setLoading(false));
      console.log(er);
    }
  };

  return loading ? (
    <Loading reduceHeight={0} />
  ) : (
    <form className="refund" onSubmit={handleOnSubmit}>
      <fieldset className="refund__container">
        <legend align="center">{content.refund.header}</legend>
        <div className="refund__form">
          <div className="refund__form__container">
            <div className="refund__form__item">
              <input
                type="text"
                id="name"
                value={info.name}
                onChange={handleInputOnChange}
                autoComplete="off"
                placeholder=" "
                required
              />
              <label htmlFor="name">
                {content.refund.name} <span>*</span>
              </label>
            </div>
            <div className="refund__form__item">
              <input
                type="email"
                id="email"
                value={info.email}
                onChange={handleInputOnChange}
                autoComplete="off"
                placeholder=" "
                required
              />
              <label htmlFor="email">
                {content.refund.email} <span>*</span>
              </label>
            </div>
            <div className="refund__form__item">
              <textarea
                id="reason"
                value={info.reason}
                onChange={handleInputOnChange}
                onInput={(e) => {
                  e.style.height = "5px";
                  e.style.height = e.scrollHeight + "px";
                }}
                autoComplete="off"
                placeholder=" "
                required
              />
              <label htmlFor="reason">
                {content.refund.reason} <span>*</span>
              </label>
            </div>
          </div>
        </div>
        <div className="refund__btn">
          <button type="button" onClick={() => navigate("/profile")}>
            {content.refund.cancel}
          </button>
          <input type="submit" value={content.refund.submit} />
        </div>
      </fieldset>
    </form>
  );
};

export default Refund;
