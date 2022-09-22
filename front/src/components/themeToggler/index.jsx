import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import sun from "../../assets/svgs/sun.svg";
import moon from "../../assets/svgs/moon.svg";
import actions from "../../services/actions";
import classServices from "../../services/utils/class";

const ThemeToggler = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");

    if (localTheme === "light") {
      classServices.classToggle("id", "moon", "show");
      classServices.classToggle("id", "sun", "hide");
    } else {
      classServices.classToggle("id", "moon", "hide");
      classServices.classToggle("id", "sun", "show");
    }
  }, []);

  return (
    <button
      className="theme-toggler"
      onClick={() => {
        if (theme === "light") {
          dispatch(actions.setTheme("dark"));
          classServices.classToggle("id", "moon", "show");
          classServices.classToggle("id", "moon", "hide");
          classServices.classToggle("id", "sun", "hide");
          classServices.classToggle("id", "sun", "show");
        } else {
          dispatch(actions.setTheme("light"));
          classServices.classToggle("id", "moon", "hide");
          classServices.classToggle("id", "moon", "show");
          classServices.classToggle("id", "sun", "show");
          classServices.classToggle("id", "sun", "hide");
        }
      }}
    >
      <img src={moon} alt="" id="moon" />
      <img src={sun} alt="" id="sun" />
    </button>
  );
};

export default ThemeToggler;
