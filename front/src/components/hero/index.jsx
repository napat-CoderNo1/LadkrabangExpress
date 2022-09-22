import React from "react";
import "./style.scss";
import bg from "../../assets/images/heroes/hero.jpg";
import { useSelector } from "react-redux";

const Hero = () => {
  const lang = useSelector((state) => state.lang);

  return (
    <div className="hero">
      <img src={bg} alt="" />
      <div className="hero__speech">
        <h1>Ladkrabang</h1>
        <h1>Express</h1>
        <p>
          {lang === "th"
            ? "การเดินทางมันแสนไกล กว่าจะถึงหัวใจมันแสนนาน  ตราบใดที่รถไฟยังวิ่งอยู่ มันไม่มีหรอกขบวนสุดท้าย  ไม่อยากเป็นหรอกรถไฟ ไปไกลแค่ไหนก็ต้องวนกลับมาที่เดิม   รถไฟอาจมีหลายราง แต่ถ้ามีเธอข้างๆเราไม่มีทางหลายใจ    ขับรถไฟก็ไม่เปงงง สับรางเก่งได้ยางงาย    รถไฟชนกันไม่น่ากลัวเท่ารถไฟยืนคุยกัน    นั่นหัวลำโพง ส่วนเรา โฮ!!ลำพัง   มีแต่สถานีพร้อมพงษ์เมื่อไหร่จะมีพร้อมรักบ้าง    ไม่อยากป็นหรอกรถไฟอยากเป็นคนในใจเธอมากกว่า"
            : "Lorem ipsum dolor sit amet, consectetur. Morbimolestie ex eu nunc tincidunt scelerisque euismod elementum tortor. Aenean eleifend auctor justo, at ornare tellus mattis et. Sed vel eliturna. In id tristique lorem. Integer cursus nisi sed ultricies Integertincidunt, orci id accumsan condimentum."}
        </p>
      </div>
    </div>
  );
};
  
export default Hero;
