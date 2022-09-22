import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import About from "../pages/about";
import ChangePassword from "../pages/auth/changePassword";
import Forgot from "../pages/auth/forgot";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Booking from "../pages/booking";
import Home from "../pages/home";
import Profile from "../pages/profile";
import StaffRefund from "../pages/staff/refund";
import StaffSearch from "../pages/staff/search";
import DisplayTicket from "../pages/ticket/display";
import Refund from "../pages/ticket/refund";
import actions from "../services/actions";
import classServices from "../services/utils/class";

const Router = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const lang = useSelector((state) => state.lang);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    const localLanguage = localStorage.getItem("lang");

    if (!!localTheme && localTheme != theme) {
      dispatch(actions.setTheme(localTheme));
    }
    if (!!localLanguage && localLanguage != lang) {
      dispatch(actions.setLanguage(localLanguage));
    }

    setTimeout(() => {
      classServices.classRemove("tag", "body", "preload");
    }, 100);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("routeError", 0);
    dispatch(actions.setLoading(false));
    dispatch(
      actions.setTrainList(JSON.parse(sessionStorage.getItem("trainList")))
    );
    dispatch(
      actions.setSeatList(JSON.parse(sessionStorage.getItem("seatList")))
    );
    dispatch(
      actions.setTicketList(JSON.parse(sessionStorage.getItem("ticketList")))
    );

    setTimeout(() => {
      classServices.classRemove("class", "navbar", "preload");
    }, 100);
  }, [navigate, location]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    localStorage.setItem("lang", lang);
  }, [theme, lang]);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="staff" element={<Home />} />
      <Route path="staff/search" element={<StaffSearch />} />
      <Route path="staff/refund" element={<StaffRefund />} />
      <Route path="login" element={<Login type={"user"} />} />
      <Route path="login/staff" element={<Login type={"staff"} />} />
      <Route path="register" element={<Register type={"user"} />} />
      <Route path="register/staff" element={<Register type={"staff"} />} />
      <Route path="forgot" element={<Forgot />} />
      <Route path="forgot/:token" element={<ChangePassword />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/staff" element={<Profile />} />
      <Route path="profile/:id" element={<DisplayTicket />} />
      <Route path="profile/:id/refund" element={<Refund />} />
      <Route path="booking" element={<Booking />} />
      <Route path="booking/:step" element={<Booking />} />
    </Routes>
  );
};

export default Router;
