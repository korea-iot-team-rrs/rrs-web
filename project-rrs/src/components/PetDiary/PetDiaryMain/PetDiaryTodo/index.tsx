import React, { useEffect, useState } from "react";
import "../../../../styles/PetDiaryTodo.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import PlusIcon from "@rsuite/icons/Plus";
import { useCookies } from "react-cookie";
import { TodoRespDto } from "../../../../types/todoType";
import { fetchTodosByDay } from "../../../../apis/todo";

export default function PetDiaryTodo() {
  const [todos, setTodos] = useState<TodoRespDto[]>([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [cookies] = useCookies(["token"]);

  const fetchTodoByDay = async () => {
    // const token = cookies.token;
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1MTIzMjgwLCJleHAiOjE3MzUxNTkyODB9.YKgHgC-ZukRkvIQSH-ImfXRHe-Qre9ph4lAC_kgj_Kc";
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const userId = 1;
      const today = new Date().toISOString().split('T')[0];
      const todos = await fetchTodosByDay(userId, today, token);
      console.log(todos); // fetchTodosByDay 이후 setTodos 호출 전 콘솔 출력
      setTodos(todos);
    } catch (error) {
      console.error("Failed to fetch todo data", error);
    }
  };

  useEffect(() => {
    fetchTodoByDay();
  }, []);


  useEffect(() => {
    fetchTodoByDay();
  }, []);

  return (
    <>
      <div className="petDiaryTodoConatiner">
        <header>
          <div>
            <h2>오늘 할 일</h2>
            <span>Today's Date</span>
          </div>
          <div>
            <Button
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
