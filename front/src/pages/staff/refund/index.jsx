import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../style.scss";
import NavBar from "../../../components/navbar";
import staffServices from "../../../services/utils/staff";

const StaffRefund = () => {
  const lang = useSelector((state) => state.lang);
  const content =
    lang === "th"
      ? require("../../../assets/jsons/staff/th.json")
      : require("../../../assets/jsons/staff/en.json");
  const [resList, setResList] = useState([]);

  const findRefund = async () => {
    let res = await staffServices.refund();
    console.log(res);
    if (res && res.length <= 0) {
      alert(
        "No refund request at the time | ไม่มีคำร้องขอยกเลิกการจอง ณ ตอนนี้"
      );
    }
    setResList(res);
  };

  useEffect(() => {
    document.title = "Staff - LKBX";
    findRefund();
  }, []);

  useEffect(() => {
    console.log(resList);
  }, [resList]);

  return (
    <>
      <NavBar />
      <div className="staff">
        <div className="staff__refund">
          <button onClick={findRefund}>
            <h1>{content.refund.header}</h1>
          </button>
        </div>
        <div className="staff__result">
          <table>
            <thead>
              <tr>
                <th>{content.result.trainNo}</th>
                <th>{content.result.origin}</th>
                <th>{content.result.destination}</th>
                <th>{content.result.name}</th>
                <th>{content.result.date}</th>
                <th>{content.result.depTime}</th>
                <th>{content.result.arrTime}</th>
                <th>{content.result.reason}</th>
                <th>{content.result.approve}</th>
              </tr>
            </thead>
            <tbody>
              {resList != undefined && resList.length > 0
                ? resList.map((res) => (
                    <tr>
                      <td>{res.ticketInfo.train_number}</td>
                      <td>{res.ticketInfo.origin}</td>
                      <td>{res.ticketInfo.destination}</td>
                      <td>{res.ticketInfo.username}</td>
                      <td>
                        {new Date(res.ticketInfo.date).toLocaleString(lang, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td>{res.ticketInfo.departureTime}</td>
                      <td>{res.ticketInfo.arrivalTime}</td>
                      <td>{res.reason}</td>
                      <td>
                        <input
                          type="checkbox"
                          onChange={async (e) => {
                            e.preventDefault();
                            if (e.target.checked) {
                              try {
                                let response =
                                  await staffServices.approveRefund(res._id);
                                setResList(response);
                                if (response && response.length <= 0) {
                                  alert(
                                    "No refund request at the time | ไม่มีคำร้องขอยกเลิกการจอง ณ ตอนนี้"
                                  );
                                }
                              } catch (er) {
                                console.log(er);
                              }
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StaffRefund;
