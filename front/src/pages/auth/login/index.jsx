import React, { useEffect, useState } from "react";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import icon from "../../../assets/icons/icon.png";
import iconDark from "../../../assets/icons/icon-dark.png";
import user from "../../../services/utils/log";
import actions from "../../../services/actions";
import Loading from "../../../components/loading";
import staff from "../../../services/utils/staff";

const Login = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.theme);
  const lang = useSelector((state) => state.lang);
  const loading = useSelector((state) => state.loading);

  useEffect(() => (document.title = "Log In - LKBX"), []);

  const content =
    lang === "th"
      ? require("../../../assets/jsons/auth/th.json")
      : require("../../../assets/jsons/auth/en.json");
  const [searchParams, _] = useSearchParams({});
  const [err, setErr] = useState(false);
  const [missingInput, setMissingInput] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [login, setLogin] = useState({
    uname: "",
    pword: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let missing = false;
    for (const i of Object.values(login)) if (i == "") missing = true;
    if (missing) {
      setErr(true);
      if (missing) setMissingInput(true);
      else setMissingInput(false);
    } else {
      setErr(false);
      try {
        dispatch(actions.setLoading(true));
        const res =
          type === "user" ? await user.logIn(login) : await staff.logIn(login);
        if (res != 400)
          if (searchParams.get("from"))
            navigate("/booking/1?" + searchParams.toString());
          else navigate("/");
      } catch (er) {
        dispatch(actions.setLoading(false));
        setInvalidLogin(true);
        setErr(true);
      }
    }
  };

  const handleInputOnChange = ({ currentTarget: input }) => {
    const temp = { ...login };
    temp[input.id] = input.value;
    setLogin(temp);
  };

  return loading ? (
    <Loading reduceHeigh={0} />
  ) : (
    <form className="login" onSubmit={handleOnSubmit}>
      <fieldset className="login__container">
        <legend align="center">
          {theme === "light" ? (
            <Link to="/" className="login__logo">
              <img src={icon} alt="" className="login__logo__icon" />
              <img src={iconDark} alt="" className="login__logo__icon hide" />
            </Link>
          ) : (
            <Link to="/" className="login__logo">
              <img src={icon} alt="" className="login__logo__icon hide" />
              <img src={iconDark} alt="" className="login__logo__icon" />
            </Link>
          )}
        </legend>
        <div className="login__form">
          <h1 className="login__form__header">
            {type === "user"
              ? content.login.header
              : content.login.staff.header}
          </h1>
          {err && (
            <div className="login__form__errors">
              {invalidLogin
                ? content.login.errors.invalidLogin
                : missingInput
                ? content.login.errors.missingInput
                : ""}
            </div>
          )}
          <div className="login__form__container">
            <div className="login__form__item">
              <input
                type="text"
                id="uname"
                name="uname"
                value={login.uname}
                onChange={handleInputOnChange}
                autoComplete="off"
                placeholder=" "
              />
              <label htmlFor="uname">
                {content.login.fields.username} <span>*</span>
              </label>
            </div>
            <div className="login__form__group">
              <div className="login__form__item">
                <input
                  type="password"
                  id="pword"
                  name="pword"
                  value={login.pword}
                  onChange={handleInputOnChange}
                  autoComplete="off"
                  placeholder=" "
                />
                <label htmlFor="pword">
                  {content.login.fields.password} <span>*</span>
                </label>
              </div>
              <div className="login__form__group__link">
                {/* <Link to="/forgot">
                  {type === "user"
                    ? content.login.forgot
                    : content.login.staff.forgot}
                </Link> */}
                <Link
                  to={{
                    pathname: type === "user" ? "/register" : "/register/staff",
                    search: searchParams.get("date")
                      ? createSearchParams({
                          from: searchParams.get("from"),
                          to: searchParams.get("to"),
                          date: searchParams.get("date"),
                          time: searchParams.get("time"),
                          pax: searchParams.get("pax"),
                        }).toString()
                      : "",
                  }}
                >
                  {content.login.register} {">"}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          className="login__btn"
          value={content.login.button}
        />
      </fieldset>
    </form>
  );
};

export default Login;
