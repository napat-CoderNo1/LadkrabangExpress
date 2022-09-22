import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const BookingButtons = ({ onNext, price, disabled, page, pastUrlParams }) => {
  const lang = useSelector((state) => state.lang);
  const navigate = useNavigate();

  return (
    <div className={`booking-btns${page === 4 ? " food" : ""}`}>
      <button
        type="button"
        onClick={() =>
          navigate(
            `/booking${
              page > 1 ? "/" + (page - 1).toString() + "?" : ""
            }${pastUrlParams}`
          )
        }
      >
        {lang === "th" ? "กลับ" : "Back"}
      </button>
      {price > 0 ? (
        <span>
          {lang === "th" ? (
            <>ราคารวม&ensp;🛈&ensp;&ensp;&ensp;&#3647;{price}</>
          ) : (
            <>Total&ensp;🛈&ensp;&ensp;&ensp;&#3647;{price}</>
          )}
        </span>
      ) : null}
      <button
        type="submit"
        onClick={onNext}
        disabled={disabled ? "disabled" : ""}
      >
        {lang === "th" ? "ต่อไป" : "Next"}
      </button>
    </div>
  );
};

export default BookingButtons;
