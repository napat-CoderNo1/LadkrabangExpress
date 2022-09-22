import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./style.scss";
import class1 from "../../assets/images/classes/class1.jpg";
import class2 from "../../assets/images/classes/class2.jpeg";
import class3 from "../../assets/images/classes/class3.jpg";
import actions from "../../services/actions";
import bookingServices from "../../services/utils/booking";
import BookingButtons from "../bookingBtns";

const ClassSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const content =
    lang === "th"
      ? require("../../assets/jsons/booking/th.json")
      : require("../../assets/jsons/booking/en.json");
  const [searchParams, _] = useSearchParams();
  const [choice, setChoice] = useState(0);
  const [price, setPrice] = useState(0);
  const [availClasses, setAvailClasses] = useState({
    f: false,
    s: false,
    t: false,
  });

  useEffect(() => {
    setPrice(searchParams.get("tp"));
    setAvailClasses({
      f: searchParams.get("c")[0] == 1 ? true : false,
      s: searchParams.get("c")[1] == 1 ? true : false,
      t: searchParams.get("c")[2] == 1 ? true : false,
    });
    sessionStorage.setItem("seatList", JSON.stringify([]));
  }, []);

  const handleOnNext = async (e) => {
    e.preventDefault();
    try {
      dispatch(actions.setLoading(true));
      await bookingServices.findSeats({
        trainId: searchParams.get("idt"),
        date: searchParams.get("date"),
      });
      navigate({
        pathname: "/booking/3",
        search:
          searchParams.toString() +
          ".000&" +
          createSearchParams({ cl: choice }).toString(),
      });
    } catch (er) {
      dispatch(actions.setLoading(false));
      console.log(er);
    }
  };

  return (
    <div className="class-selector">
      <div className="class-selector__container">
        <div className="class-selector__card__container">
          <input
            type="radio"
            value="3"
            checked={choice == "3"}
            onChange={({ currentTarget: input }) => setChoice(input.value)}
            id="3"
            name="class"
            disabled={availClasses.t ? "" : "disabled"}
          />
          <label htmlFor="3" className="class-selector__card">
            <img src={class3} alt="" />
            <div className="class-selector__card__info">
              <h1>{content.class[2].header}</h1>
              <ul>
                <li>{content.class[2].list[0]}</li>
                <li>{content.class[2].list[1]}</li>
              </ul>
              <span>&#3647;{price}</span>
            </div>
          </label>
          <input
            type="radio"
            value="2"
            checked={choice == "2"}
            onChange={({ currentTarget: input }) => setChoice(input.value)}
            id="2"
            name="class"
            disabled={availClasses.s ? "" : "disabled"}
          />
          <label htmlFor="2" className="class-selector__card">
            <img src={class2} alt="" />
            <div className="class-selector__card__info">
              <h1>{content.class[1].header}</h1>
              <ul>
                <li>{content.class[1].list[0]}</li>
                <li>{content.class[1].list[1]}</li>
              </ul>
              <span>&#3647;{price}</span>
            </div>
          </label>
          <input
            type="radio"
            value="1"
            checked={choice == "1"}
            onChange={({ currentTarget: input }) => setChoice(input.value)}
            id="1"
            name="class"
            disabled={availClasses.f ? "" : "disabled"}
          />
          <label htmlFor="1" className="class-selector__card">
            <img src={class1} alt="" />
            <div className="class-selector__card__info">
              <h1>{content.class[0].header}</h1>
              <ul>
                <li>{content.class[0].list[0]}</li>
                <li>{content.class[0].list[1]}</li>
                <li>{content.class[0].list[2]}</li>
              </ul>
              <span>&#3647;{price}</span>
            </div>
          </label>
        </div>
        <BookingButtons
          onNext={handleOnNext}
          price={choice ? searchParams.get("_p") : 0}
          disabled={choice === 0 ? true : false}
          page={2}
          pastUrlParams={searchParams.toString().split(".00")[0]}
        />
      </div>
    </div>
  );
};

export default ClassSelection;
