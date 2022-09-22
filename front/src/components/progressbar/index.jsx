import React from "react";
import "./style.scss";
import trainLight from "../../assets/svgs/train-light.svg";
import { useSelector } from "react-redux";

const ProgressBar = ({ step }) => {
  const lang = useSelector((state) => state.lang);
  const content =
    lang === "th"
      ? require("../../assets/jsons/booking/th.json")
      : require("../../assets/jsons/booking/en.json");

  return (
    <div className="progressbar">
      <div className="progressbar__container">
        <div className="progressbar__bg" />
        <div className={`progressbar__progress cur-${step}`}>
          <img src={trainLight} alt="" />
        </div>
        <div className={`progressbar__checkpoint cur-${step}`}>
          <div className="progressbar__checkpoint__container">
            <div className="progressbar__checkpoint__item" />
            <label className="progressbar__checkpoint__label">
              {content.progressbar.trains}
            </label>
          </div>
          <div className="progressbar__checkpoint__container">
            <div className="progressbar__checkpoint__item" />
            <label className="progressbar__checkpoint__label">
              {content.progressbar.classes}
            </label>
          </div>
          <div className="progressbar__checkpoint__container">
            <div className="progressbar__checkpoint__item" />
            <label className="progressbar__checkpoint__label">
              {content.progressbar.seats}
            </label>
          </div>
          <div className="progressbar__checkpoint__container">
            <div className="progressbar__checkpoint__item" />
            <label className="progressbar__checkpoint__label">
              {content.progressbar.foods}
            </label>
          </div>
          <div className="progressbar__checkpoint__container">
            <div className="progressbar__checkpoint__item" />
            <label className="progressbar__checkpoint__label">
              {content.progressbar.checkout}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
