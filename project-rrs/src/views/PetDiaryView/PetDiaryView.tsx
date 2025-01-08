import React, { useState, useEffect } from "react";
import PetDiaryCalendar from "../../components/PetDiary/PetDiaryCalendar";
import PetDiaryMain from "../../components/PetDiary/PetDiaryMain";
import "../../styles/PetDiary.css";

export default function PetDiaryView() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // selectedDate가 업데이트될 때마다 콘솔에 출력
  useEffect(() => {
    console.log("Selected date in PetDiaryView:", selectedDate);
  }, [selectedDate]);

  return (
    <div className="pet_diary_container">
      <PetDiaryCalendar onDateSelect={setSelectedDate} />
      <PetDiaryMain selectedDate={selectedDate} />
    </div>
  );
}