import React, { useEffect, useState } from "react";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import NavBar from "../../components/navbar";
import icon from "../../assets/icons/icon.png";
import { FaRedo } from "react-icons/fa";
import actions from "../../services/actions";
import userServices from "../../services/utils/user";
import ConfirmPassword from "../../components/confirmPassword";
import Loading from "../../components/loading";
import logServices from "../../services/utils/log";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = useSelector((state) => state.lang);
  const loading = useSelector((state) => state.loading);
  const stations = require("../../assets/jsons/booking/stations.json");
  const profileContent =
    lang === "th"
      ? require("../../assets/jsons/profile/th.json")
      : require("../../assets/jsons/profile/en.json");
  const ticketContent =
    lang === "th"
      ? require("../../assets/jsons/ticket/th.json")
      : require("../../assets/jsons/ticket/en.json");
  const [userInfo, setUserInfo] = useState([]);
  const [displayTickets, setDisplayTickets] = useState([]);
  const [edit, setEdit] = useState(false);
  const [confirmPwordShown, setConfirmPwordShown] = useState(false);
  const [pword, setPword] = useState("");
  const [response, setResponse] = useState(200);
  const [info, setInfo] = useState({
    fname: "",
    lname: "",
    uname: "",
    email: "",
  });

  const fetchProfile = async () => {
    let res = await userServices.fetchProfile();
    setDisplayTickets(res);
  };

  useEffect(() => {
    document.title = "Profile - LKBX";
    try {
      fetchProfile();
      setDisplayTickets(
        sessionStorage.getItem("ticketList")
          ? JSON.parse(sessionStorage.getItem("ticketList"))
          : []
      );
      localStorage.getItem("user")
        ? setUserInfo(JSON.parse(localStorage.getItem("user")))
        : navigate({
            pathname: "/login",
            search: createSearchParams({
              q: location.pathname,
            }).toString(),
          });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      fetchProfile();
      localStorage.getItem("user")
        ? setUserInfo(JSON.parse(localStorage.getItem("user")))
        : navigate({
            pathname: "/login",
            search: createSearchParams({
              q: location.pathname,
            }).toString(),
          });
    } catch {}
  }, []);

  const showStation = (data) => {
    let res = "";
    try {
      if (lang === "th") res = data;
      else {
        for (const i of stations) if (data === i["th"]) res = i["en"];
      }
    } catch {}
    return res;
  };

  const handleInputOnChange = ({ currentTarget: input }) => {
    const temp = { ...info };
    temp[input.id] = input.value;
    setInfo(temp);
    console.log(temp);
  };

  const handleOnCancelProfile = (e) => {
    e.preventDefault();
    setEdit(false);
    setInfo({
      fname: "",
      lname: "",
      uname: "",
      email: "",
    });
  };

  const handleOnSaveProfile = async (e) => {
    e.preventDefault();
    console.log({ ...info });
    try {
      dispatch(actions.setLoading(true));
      const saveRes = await userServices.editProfile(info);
      console.log(saveRes);
      if (saveRes.status == 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: saveRes.data._id,
            token: saveRes.data.token,
            fname: saveRes.data.firstname,
            lname: saveRes.data.lastname,
            email: saveRes.data.email,
            uname: saveRes.data.username,
          })
        );
        setUserInfo({
          id: saveRes.data._id,
          token: saveRes.data.token,
          fname: saveRes.data.firstname,
          lname: saveRes.data.lastname,
          email: saveRes.data.email,
          uname: saveRes.data.username,
        });
        dispatch(actions.setLoading(false));
        setEdit(false);
        setInfo({
          fname: "",
          lname: "",
          uname: "",
          email: "",
        });
      } else {
        dispatch(actions.setLoading(false));
        setInfo({
          fname: "",
          lname: "",
          uname: "",
          email: "",
        });
        alert(
          lang === "th"
            ? "ชื่อผู้ใช้งานหรืออีเมลนี้ถูกใช้แล้ว"
            : "This username or email is already taken."
        );
      }
    } catch (er) {
      dispatch(actions.setLoading(false));
      console.log(er);
    }
  };

  const handleOnReload = async (e) => {
    e.preventDefault();
    try {
      dispatch(actions.setLoading(true));
      await userServices.fetchProfile();
      navigate(0);
    } catch (er) {
      dispatch(actions.setLoading(false));
      console.log(er);
    }
  };

  const handleOnConfirmPword = async (e) => {
    e.preventDefault();
    setEdit(false);
    try {
      dispatch(actions.setLoading(true));
      let res = await userServices.confirmPassword({
        token: JSON.parse(localStorage.getItem("user")).token,
        pword: pword,
      });
      setResponse(res);
      if (res == 200) {
        navigate(`/forgot/${userInfo.token}`);
      }
    } catch (er) {
      dispatch(actions.setLoading(false));
      setResponse(er);
    }
  };

  return loading && !edit ? (
    <Loading reduceHeigh={0} />
  ) : (
    <>
      {confirmPwordShown ? (
        <ConfirmPassword
          status={response}
          setConfirmPword={setPword}
          handleOnConfirmPword={handleOnConfirmPword}
          handleOnBack={() => {
            setConfirmPwordShown(false);
            setResponse(200);
          }}
        />
      ) : null}
      <div className="profile">
        <NavBar />
        <div className="profile__container">
          <h1 className="profile__header">{profileContent.header}</h1>
          <div className="profile__content">
            <div className="profile__info">
              <fieldset>
                <legend align="center">{profileContent.info.header}</legend>
                {loading ? (
                  <Loading reduceHeight={30} />
                ) : (
                  <>
                    <form onSubmit={handleOnSaveProfile}>
                      {logServices.isLogged().isStaff ? null : edit ? null : (
                        <button type="button" onClick={() => setEdit(true)}>
                          {profileContent.info.edit}
                        </button>
                      )}
                      <div className="profile__info__100">
                        <input
                          type="text"
                          id="fname"
                          value={info.fname}
                          onChange={handleInputOnChange}
                          autoComplete="off"
                          placeholder={edit ? userInfo.fname : " "}
                          disabled={edit ? "" : "disabled"}
                        />
                        <label htmlFor="fname">
                          {profileContent.info.fname}
                        </label>
                        {edit ? null : <div>{userInfo.fname}</div>}
                      </div>
                      <div className="profile__info__100">
                        <input
                          type="text"
                          id="lname"
                          value={info.lname}
                          onChange={handleInputOnChange}
                          autoComplete="off"
                          placeholder={edit ? userInfo.lname : " "}
                          disabled={edit ? "" : "disabled"}
                        />
                        <label htmlFor="lname">
                          {profileContent.info.lname}
                        </label>
                        {edit ? null : <div>{userInfo.lname}</div>}
                      </div>
                      <div className="profile__info__100">
                        <input
                          type="text"
                          id="uname"
                          value={info.uname}
                          onChange={handleInputOnChange}
                          autoComplete="off"
                          placeholder={edit ? userInfo.uname : " "}
                          disabled={edit ? "" : "disabled"}
                        />
                        <label htmlFor="uname">
                          {profileContent.info.uname}
                        </label>
                        {edit ? null : <div>{userInfo.uname}</div>}
                      </div>
                      <div className="profile__info__100">
                        <input
                          type="email"
                          id="email"
                          value={info.email}
                          onChange={handleInputOnChange}
                          autoComplete="off"
                          placeholder={edit ? userInfo.email : " "}
                          disabled={edit ? "" : "disabled"}
                        />
                        <label htmlFor="email">
                          {profileContent.info.email}
                        </label>
                        {edit ? null : <div>{userInfo.email}</div>}
                      </div>
                      {edit ? (
                        <div className="profile__info__btns">
                          <button type="button" onClick={handleOnCancelProfile}>
                            {profileContent.info.cancel}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setConfirmPwordShown(true);
                            }}
                          >
                            {profileContent.info.changePword}
                          </button>
                          <input
                            type="submit"
                            value={profileContent.info.save}
                          />
                        </div>
                      ) : null}
                    </form>
                  </>
                )}
              </fieldset>
            </div>
            {logServices.isLogged().isStaff ? null : (
              <fieldset className="profile__booking">
                <legend className="profile__booking__header">
                  {profileContent.booking.header}
                </legend>
                <div className="profile__booking__content">
                  <div className="profile__booking__content__inner">
                    {displayTickets ? (
                      displayTickets.length !== 0 ? (
                        displayTickets.map((ticket) => (
                          <Link to={`${ticket._id}`}>
                            <div className="profile__booking__ticket">
                              <div className="profile__booking__ticket__container">
                                <div className="profile__booking__ticket__info">
                                  <div className="profile__booking__ticket__info__first-row">
                                    <div className="profile__booking__ticket__info__3">
                                      <span>{ticketContent.origin}</span>
                                      <h1>{showStation(ticket.origin)}</h1>
                                    </div>
                                    <div className="profile__booking__ticket__info__3">
                                      <span>{ticketContent.destination}</span>
                                      <h1>{showStation(ticket.destination)}</h1>
                                    </div>
                                    <div className="profile__booking__ticket__info__3">
                                      <span>{ticketContent.date}</span>
                                      <h1>
                                        {new Date(ticket.date).getDate() +
                                          new Date(ticket.date)
                                            .toLocaleString("default", {
                                              month: "short",
                                            })
                                            .toUpperCase() +
                                          new Date(ticket.date)
                                            .getFullYear()
                                            .toString()
                                            .slice(2)}
                                      </h1>
                                    </div>
                                  </div>
                                  <div className="profile__booking__ticket__info__second-row">
                                    <div className="profile__booking__ticket__info__5">
                                      <span>{ticketContent.trainNo}</span>
                                      <h1>{ticket.train_number}</h1>
                                    </div>
                                    <div className="profile__booking__ticket__info__5">
                                      <span>
                                        {ticketContent.depTime.shortened}
                                      </span>
                                      <h1>{ticket.departureTime}</h1>
                                    </div>
                                    <div className="profile__booking__ticket__info__5">
                                      <span>
                                        {ticketContent.arrTime.shortened}
                                      </span>
                                      <h1>{ticket.arrivalTime}</h1>
                                    </div>
                                    <div className="profile__booking__ticket__info__5">
                                      <span>{ticketContent.class}</span>
                                      <h1>{ticket.reservation_class}</h1>
                                    </div>
                                    <div className="profile__booking__ticket__info__5">
                                      <span>{ticketContent.passenger}</span>
                                      <h1>{ticket.passenger}</h1>
                                    </div>
                                  </div>
                                </div>
                                <div className="profile__booking__ticket__ticket-touch">
                                  <div className="profile__booking__ticket__ticket-touch__top" />
                                  <div className="profile__booking__ticket__ticket-touch__middle" />
                                  <div className="profile__booking__ticket__ticket-touch__bottom" />
                                </div>
                                <div className="profile__booking__ticket__logo">
                                  <img src={icon} alt="" />
                                  <Link to={`${ticket._id}/refund`}>
                                    {lang === "th" ? "ยกเลิก" : "Cancel"}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <section>
                          {lang === "th"
                            ? "คุณยังไม่มีตั๋วรถไฟที่จองไว้..."
                            : "You haven't reserved any tickets yet..."}
                        </section>
                      )
                    ) : (
                      <section>
                        <FaRedo onClick={handleOnReload} />
                        <span>
                          {lang === "th" ? "ลองใหม่อีกครั้ง" : "Try again"}
                        </span>
                      </section>
                    )}
                  </div>
                </div>
              </fieldset>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
