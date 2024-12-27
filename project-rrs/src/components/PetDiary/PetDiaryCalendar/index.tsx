import React, { useState, useEffect } from "react";
import { Calendar, Badge } from "rsuite";
import "../../../styles/PetdiaryCalendar.css";
import { PetDiaryCalendarProps } from "../../../types/petDiary";
import { Todo } from "../../../types/todoType";
import { fetchTodos, TOKEN } from "../../../apis/todo";

const Styles = () => {
  return <style>{`.pickedDate { border: none; background-color: #E8E8E8; }`}</style>;
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderCell(date: Date, todos: Todo[]): JSX.Element | null {
  const dateString = formatDate(date);
  const hasTodo = todos.some((todo) => todo.todoCreateAt === dateString);

  if (hasTodo) {
    return <Badge className="calendar-todo-item-badge" content="오늘의 할일" />;
  }
  return null;
}

const TodoList = ({ date, todos }: { date: string; todos: Todo[] }) => {
  const filteredTodos = todos.filter((todo) => todo.todoCreateAt === date);

  if (!filteredTodos.length) {
    return null;
  }
}

export default function PetDiaryCalendar({ onDateSelect }: PetDiaryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const token = TOKEN;
    if (selectedDate && token) {
      fetchTodos(token)
        .then(setTodos)
        .catch((err) => console.error("Failed to fetch todos", err));
    }
  }, [selectedDate]);

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