import React, { useEffect, useState } from "react";
import "../../../../styles/PetDiaryTodo.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { FaPlusCircle } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { fetchTodosByDay, TOKEN, updateTodo } from "../../../../apis/todo";
import { PetDiaryTodoProps } from "../../../../types/petDiary";
import { Todo } from "../../../../types/todoType";
import TodoUpdate from "./TodoUpdate";

export default function PetDiaryTodo({ selectedDate }: PetDiaryTodoProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [cookies] = useCookies(["token"]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTodoByDay = async () => {
    const token = TOKEN;
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

    const token = TOKEN;
    if (!token) {
      console.error("Token not found");
      return;
    }

    const requestData: Partial<{
      todoPreparationContent: string;
      todoCreateAt: string;
      todoStatus: string;
    }> = {
      todoPreparationContent: todo.todoPreparationContent,
      todoCreateAt: todo.todoCreateAt,
      todoStatus: newStatus,
    };

    try {
      const updatedTodo = await updateTodo(todo.todoId, requestData, token);
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.todoId === updatedTodo.todoId ? { ...t, todoStatus: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Failed to update todo status", error);
    }
  };

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const addButtonOnclickHandler = () => {
    setIsUpdating(true);
  };

  const goBackHandler = () => {
    setIsUpdating(false);
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTodoByDay();
    }
  }, [selectedDate, refreshKey]);

  return (
    <>
      <div className="petDiaryTodoConatiner">
        {isUpdating ? (
          <TodoUpdate
            goBack={goBackHandler}
            selectedDate={selectedDate}
            triggerRefresh={triggerRefresh}
          />
        ) : (
          <>
            <header>
              <div>
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
              <div>
                <Button
                  onClick={addButtonOnclickHandler}
                  variant="contained"
                  sx={{
                    backgroundColor: "#3DA1FF",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                    fontWeight: "bold",
                    borderRadius: "20px",
                  }}
                >
                  추가하기 &nbsp;
                  <FaPlusCircle size={"1.3em"} />
                </Button>
              </div>
            </header>
            <ul>
              {todos.length > 0 ? (
                todos.map((todo, index) => (
                  <li key={index}>
                    <span>{todo.todoPreparationContent}</span>
                    <Checkbox
                      onChange={(e) => todoCheckBoxOnChangeHandler(e, todo)}
                      {...label}
                      checked={todo.todoStatus === "1"}
                      sx={{
                        color: "#7e7e7e",
                        "&.Mui-checked": {
                          color: "#ff6b6b",
                        },
                      }}
                    />
                  </li>
                ))
              ) : (
                <div>
                  <p>작성된 내용이 없습니다.</p>
                </div>
              )}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
