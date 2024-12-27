import React from "react";
import { useNavigate } from "react-router-dom";

export default function Notice() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/announcements");
  };

  const handlePetSitterNavigate = () => {
    navigate("/PetSitter");
  };

  return (
    <div className="box noticeAndPetsitter">
      <div className="notice">
        <ul>
          <h2 onClick={handleNavigate}>Notice</h2>
          {["03", "02", "01"].map((item) => (
            <li key={item}>
              <span> 공지 {item}</span>
              <span> 공지 {item} This is mockup contents of notice</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="petsitter">
        <button onClick={handlePetSitterNavigate}>Petsitter 바로가기</button>
      </div>
    </div>
  );
}
