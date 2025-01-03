import React, { useState, useEffect } from "react";
import { Calendar, Badge } from "rsuite";
import "../../../styles/PetdiaryCalendar.css";
import { PetDiaryCalendarProps } from "../../../types/petDiaryType";
import { Todo } from "../../../types/todoType";
import { fetchTodos } from "../../../apis/todoApi";
import { useRefreshStore } from "../../../stores/refreshStore";
import { useCookies } from "react-cookie";

const Styles = () => {
  return (
    <style>{`.pickedDate { border: none; background-color: #E8E8E8; }`}</style>
  );
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderCell(date: Date, todos: Todo[]): React.ReactElement | null {
  const dateString = formatDate(date);
  const hasTodo = todos.some((todo) => todo.todoCreateAt === dateString);

  if (hasTodo) {
    return (
      <div>
        <span className="calendar-todo-item">오늘의 할일</span>
      </div>
    );
  }
  return null;
}

export default function PetDiaryCalendar({
  onDateSelect,
}: PetDiaryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [cookies] = useCookies(["token"]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const { refreshKey } = useRefreshStore();

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      fetchTodos(token)
      .then((data) => {
        setTodos(data);
      })
      .catch((err) => console.error("Failed to fetch todos", err));
    }
  }, [refreshKey]);

  const handleDateChange = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    onDateSelect(formattedDate);
  };

  return (
    <div className="petDiaryCalendar">
      <Styles />
      <Calendar
        bordered
        onChange={handleDateChange}
        onSelect={handleDateChange}
        renderCell={(date) => renderCell(date, todos)}
      />
    </div>
  );
}
