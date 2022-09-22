import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import Loading from "../../../components/loading";
import actions from "../../../services/actions";
import userServices from "../../../services/utils/user";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const lang = useSelector((state) => state.lang);
  const loading = useSelector((state) => state.loading);
  const content =
    lang === "th"
      ? require("../../../assets/jsons/auth/th.json")
      : require("../../../assets/jsons/auth/en.json");
  const [err, setErr] = useState(false);
  const [missingInput, setMissingInput] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [unmatched, setUnmatched] = useState(false);
  const [token, setToken] = useState("");
  const [pword, setPword] = useState({
    new: "",
    reNew: "",
  });

  useEffect(() => {
    document.title = "Change Password - LKBX";
    setToken(params.token);
  }, []);

  useEffect(() => {
    setErr(invalid || missingInput || unmatched);
  }, [invalid, missingInput, unmatched]);

  const handleInputOnChange = ({ currentTarget: input }) => {
    const temp = { ...pword };
    temp[input.id] = input.value;
    setPword(temp);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    let invalidPwd = false;
    let missing = false;
    for (const i of Object.values(pword)) if (i == "") missing = true;
    if (pword.new != "") {
      let regEx = new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}");
      if (regEx.test(pword.new.toString())) {
        invalidPwd = false;
      } else {
        invalidPwd = true;
      }
    }
    if (missing || invalidPwd || pword.new != pword.reNew) {
      setErr(true);
      if (missing) {
        setMissingInput(true);
      } else {
        setMissingInput(false);
      }
      if (invalidPwd) {
        setInvalid(true);
      } else {
        setInvalid(false);
      }
      if (pword.new != pword.reNew) {
        setUnmatched(true);
      } else {
        setUnmatched(false);
      }
    } else {
      setErr(false);
      try {
        dispatch(actions.setLoading(true));
        const res = await userServices.changePassword({
          token: token,
          pword: pword.new,
        });
        if (res == 200) {
          alert("Password modified | เปลี่ยนรหัสผ่านแล้ว");
          navigate("/profile");
        }
      } catch (er) {
        dispatch(actions.setLoading(false));
        setErr(true);
      }
    }
  };

  return loading ? (
    <Loading reduceHeight={0} />
  ) : (
    <form className="change-pword" onSubmit={handleOnSubmit}>
      <fieldset className="change-pword__container">
        <legend align="center">{content.changePword.header}</legend>
        <div className="change-pword__form">
          {err && (
            <div className="change-pword__form__errors">
              {missingInput
                ? content.changePword.err.missingInput
                : invalid
                ? content.changePword.err.invalid
                : unmatched
                ? content.changePword.err.noMatch
                : ""}
            </div>
          )}
          <div className="change-pword__form__container">
            <div className="change-pword__form__item">
              <input
                type="password"
                id="new"
                value={pword.new}
                onChange={handleInputOnChange}
                autoComplete="off"
                placeholder=" "
              />
              <label htmlFor="new">
                {content.changePword.new} <span>*</span>
              </label>
            </div>
            <div className="change-pword__form__item">
              <input
                type="password"
                id="reNew"
                value={pword.reNew}
                onChange={handleInputOnChange}
                autoComplete="off"
                placeholder=" "
              />
              <label htmlFor="reNew">
                {content.changePword.reNew} <span>*</span>
              </label>
            </div>
          </div>
        </div>
        <div className="change-pword__btn">
          <Link type="button" to="/profile">
            {content.changePword.cancel}
          </Link>
          <input type="submit" value={content.changePword.submit} />
        </div>
      </fieldset>
    </form>
  );
};

export default ChangePassword;
