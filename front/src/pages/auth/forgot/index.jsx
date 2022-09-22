import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./style.scss";
import Loading from "../../../components/loading";
import actions from "../../../services/actions";
import userServices from "../../../services/utils/user";

const Forgot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const loading = useSelector((state) => state.loading);
  const content =
    lang === "th"
      ? require("../../../assets/jsons/auth/th.json")
      : require("../../../assets/jsons/auth/en.json");
  const [email, setEmail] = useState("");
  const [params, setParams] = useState({
    email: "",
    token: "",
  });

  useEffect(() => (document.title = "Forgot Password - LKBX"), []);

  useEffect(
    () => (params.email !== "" && params.token !== "" ? sendEmail() : null),
    [params]
  );

  const sendEmail = async () => {
    await emailjs
      .send("kmitl_service", "forgot_template", params, "MXuG8Rwso2r8iLC1m")
      .then(
        (result) => {
          console.log(result.text);
          alert(
            lang === "th"
              ? "ส่งอีเมลสำเร็จ โปรดตรวจสอบอีเมลเพื่อดำเนินการต่อ"
              : "Email sent. Please check your email to continue."
          );
          navigate("/");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(actions.setLoading(true));
      let res = await userServices.forgot(email);
      if (res !== 400) {
        setParams({
          email: res.email,
          token: res.token,
        });
      } else console.log("error on submit");
    } catch (er) {
      dispatch(actions.setLoading(false));
      console.log(er);
    }
  };

  return loading ? (
    <Loading reduceHeight={0} />
  ) : (
    <form className="forgot" onSubmit={handleOnSubmit}>
      <fieldset className="forgot__container">
        <legend align="center">{content.forgot.legend}</legend>
        <div className="forgot__form">
          <h1>{content.forgot.header}</h1>
          <div className="forgot__form__container">
            <div className="forgot__form__item">
              <input
                type="test"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                placeholder=" "
                required
              />
              <label htmlFor="email">
                {content.forgot.user} <span>*</span>
              </label>
            </div>
          </div>
        </div>
        <div className="forgot__btn">
          <button type="button" onClick={() => navigate(-1)}>
            {content.forgot.cancel}
          </button>
          <input type="submit" value={content.forgot.submit} />
        </div>
      </fieldset>
    </form>
  );
};

export default Forgot;
