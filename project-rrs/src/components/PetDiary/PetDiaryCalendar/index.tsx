import React from 'react'
import { Calendar } from 'rsuite';
import '../../../styles/PetdiaryCalendar.css';

const Styles = () => {
  return <style>{`.pickedDate { border: none; background-colot: #E8E8E8;}`}</style>;
};

export default function PetDiaryCalendar() {
  return <>
    <div className="pet_diary_calendar">
      <Styles />
      <Calendar
        bordered
        cellClassName={(date) => 'pickedDate'}
      />
    </div>
  </>
}