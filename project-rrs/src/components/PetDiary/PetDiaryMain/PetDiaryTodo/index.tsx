import React, { useEffect, useState } from "react";
import "../../../../styles/PetDiaryTodo.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import PlusIcon from "@rsuite/icons/Plus";
import { useCookies } from "react-cookie";
import { fetchTodosByDay, updateTodo } from "../../../../apis/todo";
import { PetDiaryTodoProps } from "../../../../types/petDiary";
import { Todo } from "../../../../types/todoType";

export default function PetDiaryTodo({ selectedDate }: PetDiaryTodoProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [cookies] = useCookies(["token"]);

  const fetchTodoByDay = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1MTc3NDgzLCJleHAiOjE3MzUyMTM0ODN9.UztFizkay5CaN2haUHo3pLgBQbdrbSthezdWhKj3x7s";

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

  useEffect(() => {
    if (selectedDate) {
      fetchTodoByDay();
    }
  }, [selectedDate]);

  const addButtonOnclickHandler = () => {
    console.log("Add button clicked!");
  };

  const todoCheckBoxOnChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
    todo: Todo
  ) => {
    const isChecked = event.target.checked;
    const newStatus = isChecked ? "1" : "0";

    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1MTc3NDgzLCJleHAiOjE3MzUyMTM0ODN9.UztFizkay5CaN2haUHo3pLgBQbdrbSthezdWhKj3x7s";

    if (!token) {
      console.error("Token not found");
      return;
    }

    const requestData: Partial<{ todoPreparationContent: string; todoCreateAt: string; todoStatus: string }> = {
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

  return (
    <>
      <div className="petDiaryTodoConatiner">
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
              <PlusIcon />
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
      </div>
    </>
  );
}
