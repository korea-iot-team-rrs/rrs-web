import React, { useEffect, useState } from 'react';
import { fetchTodosByDay } from '../../../apis/todo';

interface TodaySubmit {
  today: Date;
}

export interface TodoRespDto {
  todoPreparationContent: string;
  todoCreateAt: Date;
}

export default function PetDiary({ today }: TodaySubmit) {
  const [todos, setTodos] = useState<TodoRespDto[]>([]);

  return (
    <div className="box petDiary">
      <div className="petDiaryTitle">
        <h2>Pet Diary</h2>
      </div>
      <div className="petDiaryContent">
        <div>
          <h3>오늘 할일</h3>
          <ul>
            {todos.length > 0 ? (
              <p>오늘은 할 일이 있있습니다.</p>
            ) : (
              <p>오늘은 할 일이 없습니다.</p>
            )}
          </ul>
        </div>
        <div>
          <h3>오늘의 날씨</h3>
          <p>20°C/ 온도</p>
          <p>오늘은 산책 가기 좋은 날씨! / 날씨마다 다르게 출력</p>
        </div>
      </div>
    </div>
  );
}
