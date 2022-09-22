import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./style.scss";

const ConfirmPassword = ({
  status,
  setConfirmPword,
  handleOnConfirmPword,
  handleOnBack,
}) => {
  const lang = useSelector((state) => state.lang);
  const content =
    lang === "th"
      ? require("../../assets/jsons/auth/th.json")
      : require("../../assets/jsons/auth/en.json");
  const [pword, setPword] = useState("");
  const [err, setErr] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => setIncorrect(status != 200), [handleOnConfirmPword]);
  useEffect(() => setErr(incorrect), [incorrect]);
  useEffect(() => setConfirmPword(pword), [pword]);

  return (
    <form className="confirm-pword" onSubmit={handleOnConfirmPword}>
      <div className="confirm-pword__dim" />
      <div className="confirm-pword__container">
        <div className="confirm-pword__form">
          <h1>{content.confirmPword.header}</h1>
          {err && (
            <div className="change-pword__form__errors">
              {incorrect ? content.confirmPword.err.incorrect : ""}
            </div>
          )}
          <div className="confirm-pword__form__container">
            <div className="confirm-pword__form__item">
              <input
                type="password"
                id="pword"
                value={pword}
                onChange={(e) => setPword(e.target.value)}
                autoComplete="off"
                placeholder=" "
                required
              />
              <label htmlFor="pword">
                {content.confirmPword.pword} <span>*</span>
              </label>
            </div>
            <Link to="/forgot">{content.confirmPword.forgot}</Link>
          </div>
          <div className="confirm-pword__btn">
            <button type="button" onClick={handleOnBack}>
              {content.confirmPword.back}
            </button>
            <input type="submit" value={content.confirmPword.submit} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ConfirmPassword;
