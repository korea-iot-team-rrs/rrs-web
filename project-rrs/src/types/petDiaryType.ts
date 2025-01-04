export interface PetDiaryCalendarProps {
    onDateSelect: (date: string) => void;
  }
  
  export interface PetDiaryMainProps {
    selectedDate: string;
  }
  
  export interface PetDiaryTodoProps {
    selectedDate: string;
  }