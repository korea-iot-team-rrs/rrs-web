import React, { useEffect, useState } from "react";
import "../../../styles/dangSitter/Provider.css";
import { AntSwitch } from "../../../styles/dangSitter/DangSitterCommon";
import { Calendar } from "rsuite";

export default function ProviderUpdate() {
  const [toggleChecked, setToggleChecked] = useState(false);
  const [workSchedule, setWorkSchedule] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect (() => {
    
  })

  const toggleHandleChange = () => {
    setToggleChecked(!toggleChecked);
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]; // 날짜를 'YYYY-MM-DD' 형식으로 변환
    setWorkSchedule((prevSchedule) => ({
      ...prevSchedule,
      [dateString]: !prevSchedule[dateString], // 클릭한 날짜의 근무 여부를 토글
    }));
  };

  const getWorkStatus = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return workSchedule[dateString] ? "근무" : "휴무";
  };

  return (
    <div>
      <div>
        <AntSwitch
          inputProps={{ "aria-label": "ant design" }}
          checked={toggleChecked}
          onChange={toggleHandleChange}
        />
      </div>

      <div className="providerWrapper">
        <p>근무 일정</p>
        <Calendar
          className="custom-calendar"
          onSelect={handleDateSelect}
          renderCell={(date) => {
            const workStatus = getWorkStatus(date);
            return (
              <div>
                <p>{workStatus}</p>
              </div>
            );
          }}
        />
      </div>

      <div>
        <p>소개</p>
        <input type="text" />
      </div>
    </div>
  );
}
