import React from "react";
import { Calendar } from "rsuite";
import "../../../styles/PetdiaryCalendar.css";
import { PetDiaryCalendarProps } from "../../../types/petDiary";

const Styles = () => {
  return <style>{`.pickedDate { border: none; background-color: #E8E8E8; }`}</style>;
};

export default function PetDiaryCalendar({ onDateSelect }: PetDiaryCalendarProps) {
  
  const handleDateChange = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    onDateSelect(formattedDate);
  };

  return (
    <div className="petDiaryCalendar">
      <Styles />
      <Calendar
        bordered
        onChange={handleDateChange}
        onSelect={handleDateChange}
      />
    </div>
  );
}
