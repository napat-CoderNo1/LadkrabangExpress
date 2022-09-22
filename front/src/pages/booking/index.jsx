import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../../components/navbar";
import Form from "../../components/bookingForm";
import ProgressBar from "../../components/progressbar";
import TrainsDisplay from "../../components/trainsDisplay";
import ClassSelection from "../../components/classSelection";
import SeatSelection from "../../components/seatSelection";
import FoodCatalogue from "../../components/foodCatalogue";
import Checkout from "../../components/checkout";
import Loading from "../../components/loading";

const Booking = () => {
  const loading = useSelector((state) => state.loading);
  const step = Number(useParams().step);

  useEffect(() => (document.title = "Booking - LKBX"), []);

  return (
    <>
      <NavBar />
      {step ? <ProgressBar step={step} /> : null}
      {loading ? (
        <Loading reduceHeight={22} />
      ) : (
        <>
          {!step ? <Form /> : null}
          {step === 1 ? <TrainsDisplay /> : null}
          {step === 2 ? <ClassSelection /> : null}
          {step === 3 ? <SeatSelection /> : null}
          {step === 4 ? <FoodCatalogue /> : null}
          {step === 5 ? <Checkout /> : null}
        </>
      )}
    </>
  );
};

export default Booking;
