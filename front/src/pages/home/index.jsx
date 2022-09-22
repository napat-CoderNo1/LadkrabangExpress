import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Hero from "../../components/hero";
import HomeForm from "../../components/homeForm";
import Loading from "../../components/loading";
import NavBar from "../../components/navbar";
import logServices from "../../services/utils/log";

const Home = () => {
  const loading = useSelector((state) => state.loading);

  useEffect(() => (document.title = "Home - LKBX"), []);

  return loading ? (
    <Loading reduceHeight={0} />
  ) : (
    <>
      <NavBar />
      <Hero />
      {logServices.isLogged() && logServices.isLogged().isStaff ? null : (
        <HomeForm />
      )}
    </>
  );
};

export default Home;
