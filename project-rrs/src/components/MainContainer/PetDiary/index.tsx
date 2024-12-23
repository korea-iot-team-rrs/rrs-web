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

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await fetchTodosByDay(today); // TodoRespDto[] 반환
        setTodos(response); // 받아온 데이터를 상태로 저장
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    loadTodos();
  }, [today]);

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
              todos.map((todo, index) => (
                <li key={index}>
                  <input type="checkbox" name="todocheckbox" />
                  {todo.todoPreparationContent}
                </li>
              ))
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
