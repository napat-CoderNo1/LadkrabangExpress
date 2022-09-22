import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import user from "../../../services/utils/registry";
import actions from "../../../services/actions";
import Loading from "../../../components/loading";
import staff from "../../../services/utils/staff";

const Register = ({ type }) => {
  useEffect(() => (document.title = "Sign Up - LKBX"), []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const loading = useSelector((state) => state.loading);
  const content =
    lang === "th"
      ? require("../../../assets/jsons/auth/th.json")
      : require("../../../assets/jsons/auth/en.json");
  const [searchParams, _] = useSearchParams({});
  const [err, setErr] = useState(false);
  const [missingInput, setMissingInput] = useState(false);
  const [invalidPword, setInvalidPword] = useState(false);
  const [invalidRepwd, setInvalidRepwd] = useState(false);
  const [invalidAcc, setInvalidAcc] = useState(false);
  const [repwd, setRepwd] = useState("");
  const [reg, setReg] = useState({
    fname: "",
    lname: "",
    email: "",
    uname: "",
    pword: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let missing = false;
    let invalidPwd = false;
    for (const i of Object.values(reg)) if (i == "") missing = true;
    if (reg.pword != "") {
      let regEx = new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}");
      if (regEx.test(reg.pword)) {
        invalidPwd = false;
      } else {
        invalidPwd = true;
      }
    } else {
      invalidPwd = true;
    }

    if (missing || invalidPwd || reg.pword != repwd) {
      setErr(true);
      if (missing) {
        setMissingInput(true);
      } else {
        setMissingInput(false);
      }
      if (invalidPwd) {
        setInvalidPword(true);
      } else {
        setInvalidPword(false);
      }
      if (reg.pword != repwd) {
        setInvalidRepwd(true);
      } else {
        setInvalidRepwd(false);
      }
    } else {
      setErr(false);
      try {
        dispatch(actions.setLoading(true));
        const res =
          type === "user"
            ? await user.register(reg)
            : await staff.register(reg);
        if (res != 409)
          navigate({
            pathname: type === "user" ? "/login" : "/login/staff",
            search: searchParams.toString(),
          });
      } catch (er) {
        dispatch(actions.setLoading(false));
        setInvalidAcc(true);
        setErr(true);
      }
    }
  };

  const handleInputOnChange = ({ currentTarget: input }) => {
    const temp = { ...reg };
    temp[input.id] = input.value;
    setReg(temp);
  };

  return loading ? (
    <Loading reduceHeight={0} />
  ) : (
    <form className="register" onSubmit={handleOnSubmit}>
      <fieldset className="register__container">
        <legend align="center">
          {type === "user"
            ? content.register.header
            : content.register.staff.header}
        </legend>
        <div className="register__form">
          {err && (
            <div className="register__form__errors">
              {missingInput
                ? content.register.errors.missingInput
                : invalidAcc
                ? content.register.errors.invalidAcc
                : invalidPword
                ? content.register.errors.invalidPword
                : invalidRepwd
                ? content.register.errors.invalidRepwd
                : ""}
            </div>
          )}
          <div className="register__form__first-row">
            <div className="register__form__name">
              <input
                type="text"
                id="fname"
                name="fname"
                value={reg.fname}
                onChange={handleInputOnChange}
                placeholder=" "
                autoComplete="off"
              />
              <label htmlFor="fname">
                {content.register.fields.fname} <span>*</span>
              </label>
            </div>
            <div className="register__form__name">
              <input
                type="text"
                id="lname"
                name="lname"
                value={reg.lname}
                onChange={handleInputOnChange}
                placeholder=" "
                autoComplete="off"
              />
              <label htmlFor="lname">
                {content.register.fields.lname} <span>*</span>
              </label>
            </div>
          </div>
          <div className="register__form__others">
            <input
              type="email"
              id="email"
              name="email"
              value={reg.email}
              onChange={handleInputOnChange}
              placeholder=" "
              autoComplete="off"
            />
            <label htmlFor="email">
              {content.register.fields.email} <span>*</span>
            </label>
          </div>
          <div className="register__form__others">
            <input
              type="text"
              id="uname"
              name="uname"
              value={reg.uname}
              onChange={handleInputOnChange}
              placeholder=" "
              autoComplete="off"
            />
            <label htmlFor="uname">
              {content.register.fields.uname} <span>*</span>
            </label>
          </div>
          <div className="register__form__others">
            <input
              type="password"
              id="pword"
              name="pword"
              value={reg.pword}
              onChange={handleInputOnChange}
              placeholder=" "
              autoComplete="off"
            />
            <label htmlFor="pword">
              {content.register.fields.pword} <span>*</span>
            </label>
          </div>
          <div className="register__form__others">
            <input
              type="password"
              id="repwd"
              name="repwd"
              value={repwd}
              onChange={({ currentTarget: input }) => setRepwd(input.value)}
              placeholder=" "
              autoComplete="off"
            />
            <label htmlFor="repwd">
              {content.register.fields.repwd} <span>*</span>
            </label>
          </div>
          <div className="register__form__last-row">
            <Link
              to={{
                pathname: type === "user" ? "/login" : "/login/staff",
                search: searchParams.toString(),
              }}
              className="register__form__last-row__back"
            >
              {content.register.buttons.back}
            </Link>
            <input
              type="submit"
              className="register__form__last-row__submit"
              value={content.register.buttons.submit}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default Register;
