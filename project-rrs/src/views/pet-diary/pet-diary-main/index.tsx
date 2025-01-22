import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import "../../../styles/PetDiary.css";
import PetDiaryCalendar from "../pet-diary-calendar";
import PetDiaryContents from "../pet-diary-contents";
=======
import PetDiaryCalendar from "../pet-diary-calendar";
import PetDiaryContents from "../pet-diary-contents";
import "../../../styles/pet-diary/petDiary.css";
>>>>>>> develop

export default function PetDiaryMain() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    console.log("Selected date in PetDiaryView:", selectedDate);
  }, [selectedDate]);

  return (
    <div className="pet_diary_container">
      <PetDiaryCalendar onDateSelect={setSelectedDate} />
      <PetDiaryContents selectedDate={selectedDate} />
    </div>
  );
}