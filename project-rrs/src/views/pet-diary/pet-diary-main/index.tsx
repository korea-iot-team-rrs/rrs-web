import React, { useState } from "react";
import PetDiaryCalendar from "../pet-diary-calendar";
import PetDiaryContents from "../pet-diary-contents";
import "../../../styles/pet-diary/petDiary.css";

export default function PetDiaryMain() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  return (
    <div className="pet_diary_container">
      <PetDiaryCalendar onDateSelect={setSelectedDate} />
      <PetDiaryContents selectedDate={selectedDate} />
    </div>
  );
}
