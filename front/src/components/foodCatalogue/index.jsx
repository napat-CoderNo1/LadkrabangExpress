import React, { useEffect, useRef, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import BookingButtons from "../bookingBtns";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import actions from "../../services/actions";
import useHorizontalScroll from "../../hooks/useHorizontalScroll";

const FoodCatalogue = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const trainList = useSelector((state) => state.trains);
  const foods = require("../../assets/jsons/booking/foods.json");
  const hScroll = useHorizontalScroll();
  const [searchParams, _] = useSearchParams();
  const [category, setCategory] = useState(0);
  const [foodList, setFoodList] = useState([]);
  const [filteredFoodList, setFilteredFoodList] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [optionVals, setOptionVals] = useState({});
  const [optionPrice, setOptionPrice] = useState([]);
  const [optionIds, setOptionIds] = useState({});
  const [optionValues, setOptionValues] = useState({});
  const [optionNames, setOptionNames] = useState({});
  const [optionNamesTH, setOptionNamesTH] = useState({});
  const [optionNamesEN, setOptionNamesEN] = useState({});
  const [foodCart, setFoodCart] = useState([]);
  const [displayFoodCart, setDisplayFoodCart] = useState([]);
  const [totalFoodPrice, setTotalFoodPrice] = useState(0);
  const [train, setTrain] = useState({});
  const [ticket, setTicket] = useState({});

  useEffect(() => {
    setFoodList(foods.item);
    setFoodCategories(foods.tag);
    setFoodOptions(foods.option);
    dispatch(
      actions.setTrainList(JSON.parse(sessionStorage.getItem("trainList")))
    );
  }, []);

  useEffect(() => {
    setTrain(
      trainList
        ? trainList.filter((obj) => obj.train_id == searchParams.get("idt"))[0]
        : {}
    );
  }, [trainList]);

  useEffect(() => {
    try {
      console.log(train);
      setTicket({
        t_id: searchParams.get("idt"),
        t_n: train.trainNumber,
        dt: train.date,
        or: train.origin,
        des: train.destination,
        pax: train.passenger,
        r_c: Number(searchParams.get("cl")),
        d_t: train.departureTime,
        a_t: train.arrivalTime,
        d: train.duration,
        tp: train.ticketPrice,
        f_r: Object.values(displayFoodCart),
        s: JSON.parse(searchParams.get("s")),
      });
    } catch {}
  }, [train, displayFoodCart]);

  useEffect(() => {
    try {
      setFilteredFoodList(
        foodList.filter((food) => food.tag.includes(category))
      );
    } catch {}
  }, [category]);

  useEffect(() => {
    let temp = Array(foodList.length).fill("");
    (category === 0 ? foodList : filteredFoodList).map((_, i) => {
      let res = "";
      Object.keys(optionNamesEN)
        .filter((opt) => opt.includes(i))
        .map((data) => {
          res += " " + optionNamesEN[data];
        });
      temp[i] = res;
    });
    setOptionNames(temp);
  }, [optionNamesEN, category]);

  useEffect(() => {
    let temp = Array(foodList.length).fill("");
    (category === 0 ? foodList : filteredFoodList).map((_, i) => {
      let res = "";
      Object.keys(optionNamesTH)
        .sort()
        .filter((opt) => opt.includes(i))
        .map((data) => {
          res += " " + optionNamesTH[data];
        });
      temp[i] = res;
    });
    setOptionValues(temp);
  }, [optionNamesTH, category, foodList]);

  useEffect(() => {
    setOptionPrice([]);
    let temp = Array(foodList.length).fill("");
    (category === 0 ? foodList : filteredFoodList).map((_, i) => {
      let res = 0;
      Object.keys(optionVals)
        .filter((opt) => opt.includes(i))
        .map((data) => {
          res += Number(optionVals[data]);
        });
      temp[i] = res;
    });
    setOptionPrice(temp);
  }, [optionVals, category, foodList]);

  useEffect(() => {
    try {
      let temp = {};
      let p = 0;
      foodCart.map((cartItem) => {
        p += Number(cartItem.price);
        if (Object.keys(temp).includes(cartItem.th)) {
          temp[cartItem.th].amount += 1;
        } else {
          temp[cartItem.th] = {
            en: cartItem.en,
            foodName: cartItem.th,
            amount: 1,
            price: cartItem.price,
          };
        }
      });
      setDisplayFoodCart(temp);
      setTotalFoodPrice(p);
    } catch {}
  }, [foodCart]);

  useEffect(() => {
    console.log(displayFoodCart, foodCart);
  }, [displayFoodCart]);

  useEffect(() => {
    console.log(totalFoodPrice);
  }, [totalFoodPrice]);

  const handleOnNext = (e) => {
    e.preventDefault();
    console.log(ticket);
    navigate({
      pathname: "/booking/5",
      search:
        searchParams.toString() +
        ".00000&" +
        createSearchParams({
          tkt: JSON.stringify(ticket),
          _price: Number(searchParams.get("_p")) + totalFoodPrice,
        }).toString(),
    });
  };

  return (
    <div className="food-catalogue">
      <div className="food-catalogue__catalogue">
        <div ref={hScroll} className="food-catalogue__catalogue__radio">
          <div className="food-catalogue__catalogue__radio__inner">
            <input
              checked={category === 0}
              onChange={(e) => setCategory(Number(e.target.value))}
              type="radio"
              id="0"
              value="0"
              name="category"
            />
            <label htmlFor="0">{lang === "th" ? "ทั้งหมด" : "All"}</label>
            {foodCategories.map((cat, i) => (
              <>
                <input
                  checked={category === cat.value}
                  onChange={(e) => setCategory(e.target.value)}
                  type="radio"
                  id={i + 1}
                  value={cat.value}
                  name="category"
                />
                <label htmlFor={i + 1}>{cat.name[lang]}</label>
              </>
            ))}
          </div>
        </div>
        <div className="food-catalogue__catalogue__container">
          <div className="food-catalogue__catalogue__inner">
            {foodList && foodList.length > 0 ? (
              (category === 0 ? foodList : filteredFoodList).map((food, i) => (
                <div className="food-catalogue__catalogue__card">
                  <section>
                    <img src={food.pic} alt="" />
                    <h3>{food.name[lang]}</h3>
                    <p>{food.description}</p>
                    <span>
                      &#3647;
                      {optionPrice[i]
                        ? food.price + optionPrice[i]
                        : food.price}
                    </span>
                    <button
                      onClick={() => {
                        setFoodCart([
                          ...foodCart,
                          {
                            th: food.name["th"] + optionValues[i],
                            en:
                              food.name["en"] +
                              (optionNames[i] ? optionNames[i] : ""),
                            price: food.price + optionPrice[i],
                          },
                        ]);
                      }}
                    >
                      +
                    </button>
                    <div className="food-catalogue__catalogue__card__option">
                      {food.option.map((optName, j) => (
                        <div className="food-catalogue__catalogue__card__option__container">
                          <div className="food-catalogue__catalogue__card__option__inner">
                            {foodOptions[optName].map((opt, k) => (
                              <>
                                <input
                                  type="radio"
                                  id={i + "-" + j + "-" + k}
                                  name={optName + "-" + i + "-" + j}
                                  value={i + j + k}
                                  onChange={() => {
                                    let optTemp = { ...optionVals };
                                    let idTemp = { ...optionIds };
                                    let nameTempTH = { ...optionNamesTH };
                                    let nameTempEN = { ...optionNamesEN };
                                    optTemp[i + "-" + optName] = Number(
                                      opt.price
                                    );
                                    idTemp[optName + "-" + i + "-" + j] =
                                      i + "-" + j + "-" + k;
                                    nameTempTH[i + "-" + optName] = opt.value;
                                    nameTempEN[i + "-" + optName] =
                                      opt.option.en;
                                    setOptionVals(optTemp);
                                    setOptionIds(idTemp);
                                    setOptionNamesTH(nameTempTH);
                                    setOptionNamesEN(nameTempEN);
                                  }}
                                  checked={
                                    optionIds[optName + "-" + i + "-" + j] ==
                                    i + "-" + j + "-" + k
                                  }
                                />
                                <label htmlFor={i + "-" + j + "-" + k}>
                                  {opt.option[lang]}
                                </label>
                              </>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="food-catalogue__cart">
        <div className="food-catalogue__cart__container">
          <div className="food-catalogue__cart__inner">
            {Object.keys(displayFoodCart).length !== 0
              ? Object.keys(displayFoodCart).map((item) => (
                  <div className="food-catalogue__cart__group">
                    <section>
                      <div className="food-catalogue__cart__name">
                        {lang === "th" ? item : displayFoodCart[item].en}
                      </div>
                      <div className="food-catalogue__cart__amount">
                        <button
                          onClick={() => {
                            let temp = { ...displayFoodCart };
                            let fcTemp = [...foodCart];
                            let res = "";
                            if (temp[item].amount <= 0) {
                              delete temp[item];
                            } else temp[item].amount -= 1;
                            foodCart.map((fc, i) =>
                              fc.th === item ? (res = i) : null
                            );
                            fcTemp.splice(res, 1);
                            setFoodCart(fcTemp);
                            setDisplayFoodCart(temp);
                          }}
                        >
                          <AiOutlineMinusCircle />
                        </button>
                        <span>{displayFoodCart[item].amount}</span>
                        <button
                          onClick={() => {
                            let temp = { ...displayFoodCart };
                            let fcTemp = [...foodCart];
                            temp[item].amount >= 10
                              ? (temp[item].amount = 10)
                              : (temp[item].amount += 1);
                            fcTemp.push({
                              th: item,
                              en: temp[item].en,
                              price: temp[item].price,
                            });
                            setFoodCart(fcTemp);
                            setDisplayFoodCart(temp);
                          }}
                        >
                          <AiOutlinePlusCircle />
                        </button>
                      </div>
                    </section>
                    <span>
                      &#3647;
                      {displayFoodCart[item].price *
                        displayFoodCart[item].amount}
                    </span>
                  </div>
                ))
              : null}
          </div>
        </div>
        <BookingButtons
          onNext={handleOnNext}
          price={Number(searchParams.get("_p")) + Number(totalFoodPrice)}
          disabled={false}
          page={4}
          pastUrlParams={searchParams.toString().split(".0000")[0]}
        />
      </div>
    </div>
  );
};

export default FoodCatalogue;
