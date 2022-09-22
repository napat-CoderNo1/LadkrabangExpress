import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./style.scss";
import NavBar from "../../components/navbar";
import {
  BsChevronDown,
  BsInstagram,
  BsGithub,
  BsGeoAltFill,
  BsFillEnvelopeOpenFill,
} from "react-icons/bs";
import actions from "../../services/actions";
import Loading from "../../components/loading";

const About = () => {
  const membersRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.lang);
  const loading = useSelector((state) => state.loading);
  const content =
    lang === "th"
      ? require("../../assets/jsons/about/th.json")
      : require("../../assets/jsons/about/en.json");
  const [params, setParams] = useState({
    name: "",
    email: "",
    content: "",
  });

  useEffect(() => (document.title = "About Us - LKBX"), []);

  const handleInputOnChange = ({ currentTarget: e }) => {
    const temp = { ...params };
    temp[e.id] = e.value;
    setParams(temp);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    dispatch(actions.setLoading(true));
    await emailjs
      .send("kmitl_service", "contact_template", params, "MXuG8Rwso2r8iLC1m")
      .then(
        (result) => {
          dispatch(actions.setLoading(false));
          console.log(result.text);
          alert(
            lang === "th"
              ? "ส่งอีเมลสำเร็จ โปรดตรวจสอบอีเมลเพื่อดำเนินการต่อ"
              : "Email sent. Please check your email to continue."
          );
          navigate(0);
        },
        (error) => {
          dispatch(actions.setLoading(false));
          console.log(error.text);
        }
      );
  };

  return loading ? (
    <Loading reduceHeight={0} />
  ) : (
    <>
      <NavBar />
      <div className="about">
        <header>
          <section>
            <h2>{content.subtitle}</h2>
            <h1>{content.title}</h1>
            <h3>{content.subsubtitle}</h3>
            <BsChevronDown
              onClick={() =>
                membersRef.current.scrollIntoView({ behavior: "smooth" })
              }
            />
          </section>
        </header>
        <main>
          <section ref={membersRef}>
            {content.members && content.members.length > 0
              ? content.members.map((member) => (
                  <div>
                    <img src={member.pic} alt="" />
                    <div>
                      <h1>{member.fname}</h1>
                      <h1>{member.lname}</h1>
                      <h2>{member.position}</h2>
                    </div>
                    <ul>
                      <li>{member.fname}</li>
                      <li>{member.lname}</li>
                      <li>
                        <a href={member.instagram}>
                          <BsInstagram />
                        </a>
                        &ensp;&ensp;
                        <a href={member.github}>
                          <BsGithub />
                        </a>
                      </li>
                      <li></li>
                    </ul>
                  </div>
                ))
              : null}
          </section>
          <h1>{content.about}</h1>
          <span />
        </main>
        <footer>
          <form onSubmit={handleOnSubmit}>
            <span />
            <div />
            <h1>{content.contact.title}</h1>
            <section>
              <div className="about-input">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={params.name}
                  onChange={handleInputOnChange}
                  autoComplete="off"
                  placeholder=" "
                  required
                />
                <label htmlFor="name">
                  {content.contact.name} <span>*</span>
                </label>
              </div>
              <div className="about-input">
                <input
                  type="email"
                  id="email"
                  value={params.email}
                  onChange={handleInputOnChange}
                  autoComplete="off"
                  placeholder=" "
                  required
                />
                <label htmlFor="email">
                  {content.contact.email} <span>*</span>
                </label>
              </div>
              <div className="about-text-area">
                <textarea
                  id="content"
                  value={params.content}
                  onChange={handleInputOnChange}
                  onInput={(e) => {
                    e.style.height = "5px";
                    e.style.height = e.scrollHeight + "px";
                  }}
                  autoComplete="off"
                  placeholder=" "
                  required
                />
                <label htmlFor="content">
                  {content.contact.content} <span>*</span>
                </label>
              </div>
              <input type="submit" value={content.contact.submit} />
            </section>
          </form>
          <hr />
          <section>
            <span>{content.copyright}</span>
            <div>
              <div>
                <BsFillEnvelopeOpenFill />
                &ensp;
                {content.email}
              </div>
              <div>
                <BsGeoAltFill />
                &ensp;
                {content.location}
              </div>
            </div>
          </section>
        </footer>
      </div>
    </>
  );
};

export default About;
