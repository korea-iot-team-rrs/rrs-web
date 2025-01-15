import React, { useEffect, useState } from "react";
import "../../../../styles/PetDiaryTodo.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { FaPlusCircle } from "react-icons/fa";
import { useCookies } from "react-cookie";
import {
  deleteTodo,
  fetchTodosByDay,
  updateTodo,
} from "../../../../apis/todoApi";
import { PetDiaryTodoProps } from "../../../../types/petDiaryType";
import { Todo } from "../../../../types/todoType";
import TodoCreate from "./TodoCreate";
import TodoUpdate from "./TodoUpdate";
import { useRefreshStore } from "../../../../stores/refreshStore";
import useAuthStore from "../../../../stores/useAuthStore";

export default function PetDiaryTodo({ selectedDate }: PetDiaryTodoProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [cookies] = useCookies(["token"]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { refreshKey, incrementRefreshKey } = useRefreshStore();
  const { isLoggedIn } = useAuthStore();

  const fetchTodoByDay = async () => {
    const token = cookies.token;
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const todos = await fetchTodosByDay(selectedDate, token);
      setTodos(todos);
    } catch (error) {
      console.error("Failed to fetch todo data", error);
      setTodos([]);
    }
  };

  const todoCheckBoxOnChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
    todo: Todo
  ) => {
    const isChecked = event.target.checked;
    const newStatus = isChecked ? "1" : "0";

    const token = cookies.token;
    if (!token) {
      console.error("Token not found");
      return;
    }

    const requestData = {
      todoPreparationContent: todo.todoPreparationContent,
      todoCreateAt: todo.todoCreateAt,
      todoStatus: newStatus,
    };

    try {
      await updateTodo(todo.todoId, requestData, token);
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.todoId === todo.todoId ? { ...t, todoStatus: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Failed to update todo status", error);
    }
  };

  const deleteOnClickBtnHandler = async (todoId: number) => {
    const token = cookies.token;
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      await deleteTodo(todoId, token);
      incrementRefreshKey();
    } catch (error) {
      console.error("Failed to delete todo status", error);
    }
  };

  const addButtonOnClickHandler = () => {
    setIsCreating(true);
  };

  const updateButtonOnClickHandler = (todo: Todo) => {
    setCurrentTodo(todo);
    setIsUpdating(true);
  };

  const goBackHandler = () => {
    setIsCreating(false);
    setIsUpdating(false);
    setCurrentTodo(null);
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTodoByDay();
    }
  }, [selectedDate, refreshKey]);

  return (
    <div className="petDiaryTodoContainer">
      {isLoggedIn ? (
        <>
          {isCreating ? (
            <TodoCreate goBack={goBackHandler} selectedDate={selectedDate} />
          ) : isUpdating ? (
            <TodoUpdate
              selectedDate={selectedDate}
              currentTodo={currentTodo}
              goBack={goBackHandler}
            />
          ) : (
            <>
              <header>
                <div>
                  <div className="headerMain">
                    <h2>오늘 할 일</h2>
                    <span>
                      {selectedDate && (
                        <>
                          {selectedDate.split("-")[0]}년 &nbsp;
                          {selectedDate.split("-")[1]}월 &nbsp;
                          {selectedDate.split("-")[2]}일
                        </>
                      )}
                    </span>
                  </div>
                  <div className="headerBtn">
                    <Button
                      onClick={addButtonOnClickHandler}
                      variant="contained"
                      sx={{
                        backgroundColor: "#3DA1FF",
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "none",
                        },
                        fontWeight: "bold",
                        borderRadius: "20px",
                        fontFamily: "'Pretendard', Arial, sans-serif;",
                      }}
                    >
                      추가하기 &nbsp;
                      <FaPlusCircle size={"1.3em"} />
                    </Button>
                  </div>
                </div>
              </header>
              <ul className="todoList">
                {todos.length > 0 ? (
                  todos.map((todo, index) => (
                    <li
                      key={index}
                      style={{
                        backgroundColor:
                          todo.todoStatus === "1" ? "#ffcdcd71" : "transparent",
                      }}
                    >
                      <span>{todo.todoPreparationContent}</span>
                      <div className="rightBtns">
                        <div className="deleteAndModify">
                          <button
                            type="button"
                            onClick={() => updateButtonOnClickHandler(todo)}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deleteOnClickBtnHandler(todo.todoId)}
                          >
                            삭제
                          </button>
                        </div>
                        <Checkbox
                          checked={todo.todoStatus === "1"}
                          onChange={(e) => todoCheckBoxOnChangeHandler(e, todo)}
                          sx={{
                            padding: "0px",
                            color: "#7e7e7e",
                            "&.Mui-checked": {
                              color: "#ff6b6b",
                            },
                          }}
                        />
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="noContents">
                    <p>작성된 내용이 없습니다.</p>
                  </div>
                )}
              </ul>
            </>
          )}
        </>
      ) : (
        <div className="todo-dog">
          <div className="speech-bubble">
              <p>로그인을 후 이용하실 수 있는 서비스 입니다.</p>
          </div>
          <div>
            <p className="dog-imo">🐶</p>
          </div>
        </div>
      )}
    </div>
  );
}
