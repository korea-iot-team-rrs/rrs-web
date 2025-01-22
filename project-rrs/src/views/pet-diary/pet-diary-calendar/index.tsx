import React, { useState, useEffect } from "react";
import { Calendar } from "rsuite";
import { PetDiaryCalendarProps } from "../../../types/petDiaryType";
import { Todo } from "../../../types/todoType";
import { fetchTodos } from "../../../apis/todoApi";
import { useRefreshStore } from "../../../stores/refresh.store";
import { useCookies } from "react-cookie";
import { WalkingRecord } from "../../../stores/usePet.store";
import axios from "axios";
import { HealthRecord } from "../../../types/healthType";
import { fetchAllHealthRecordsByUserId } from "../../../apis/petHealthApi";
import "../../../styles/pet-diary/petdiaryCalendar.css";

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

function renderCell(
  date: Date,
  todos: Todo[],
  walkingRecords: WalkingRecord[],
  healthRecords: HealthRecord[]
): React.ReactElement | null {
  const dateString = formatDate(date);
  const hasTodo = todos.some((todo) => todo.todoCreateAt === dateString);
  const hasWalkingRecord = walkingRecords.some(
    (record) => record.walkingRecordCreateAt === dateString
  );
  const hasHealthRecord = healthRecords.some(
    (healthRecord) => healthRecord.createdAt === dateString
  );

  return (
    <div>
      {hasTodo && <span className="calendar-todo-item">오늘의 할일</span>}
      {hasWalkingRecord && (
        <span className="calendar-walking-record-item">산책 기록</span>
      )}
      {hasHealthRecord && (
        <span className="calendar-health-record-item">건강 기록</span>
      )}
    </div>
  );
}

export default function PetDiaryCalendar({
  onDateSelect,
}: PetDiaryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [cookies] = useCookies(["token"]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const { refreshKey } = useRefreshStore();
  const [walkingRecords, setWalkingRecords] = useState<WalkingRecord[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      fetchTodos(token)
        .then((data) => {
          setTodos(data);
        })
        .catch((err) => console.error("Failed to fetch todos", err));
      fetchAllHealthRecordsByUserId(token).then((data) => {
        setHealthRecords(data);
      });
      axios
        .get("http://localhost:4040/api/v1/walking-record", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((responses) => {
          setWalkingRecords(responses.data.data);
        })
        .catch((err) => console.error("Failed to fetch walking records", err));
    }
  }, [refreshKey, cookies.token]);

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
        renderCell={(date) =>
          renderCell(date, todos, walkingRecords, healthRecords)
        }
      />
    </div>
  );
}
