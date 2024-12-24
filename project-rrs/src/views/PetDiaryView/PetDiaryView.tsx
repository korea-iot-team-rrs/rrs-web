import React from 'react'
import PetDiaryCalendar from '../../components/PetDiary/PetDiaryCalendar'
import '../../styles/PetDiary.css'
import PetDiaryMain from '../../components/PetDiary/PetDiaryMain'

export default function PetDiaryView() {
  return <>
    <div className='pet_diary_container'>
      <PetDiaryCalendar />
      <PetDiaryMain />
    </div>
  </>
}