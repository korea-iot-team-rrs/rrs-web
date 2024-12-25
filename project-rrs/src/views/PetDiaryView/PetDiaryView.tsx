import React, { useEffect, useState } from "react";
import PetDiaryCalendar from "../../components/PetDiary/PetDiaryCalendar";
import "../../styles/PetDiary.css";
import PetDiaryMain from "../../components/PetDiary/PetDiaryMain";

export default function PetDiaryView() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  useEffect(() => {
    console.log("Current selectedDate in PetDiaryView:", selectedDate);
  }, [selectedDate]);
  return (
    <>
      <div className="pet_diary_container">
      <PetDiaryCalendar onDateSelect={setSelectedDate} />
      <PetDiaryMain selectedDate={selectedDate} />
      </div>
    </>
  );
}
