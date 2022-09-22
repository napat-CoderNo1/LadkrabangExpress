import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import actions from "../../services/actions";
import classServices from "../../services/utils/class";

const LangToggler = () => {
  const lang = useSelector((state) => state.lang);
  const dispatch = useDispatch();

  useEffect(() => {
    const localLang = localStorage.getItem("lang");

    if (localLang === "en") {
      classServices.classToggle("id", "en", "hide");
    } else {
      classServices.classToggle("id", "th", "hide");
    }
  }, []);

  return (
    <button
      className="lang-toggler"
      onClick={() => {
        if (lang === "en") {
          dispatch(actions.setLanguage("th"));
          classServices.classToggle("id", "th", "hide");
          classServices.classToggle("id", "en", "hide");
        } else {
          dispatch(actions.setLanguage("en"));
          classServices.classToggle("id", "th", "hide");
          classServices.classToggle("id", "en", "hide");
        }
      }}
    >
      <div id="en">EN</div>
      <div id="th">TH</div>
    </button>
  );
};

export default LangToggler;
