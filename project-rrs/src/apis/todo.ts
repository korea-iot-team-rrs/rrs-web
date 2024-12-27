// apis

import axios from "axios";
import { Todo } from "../types/todoType";
import { MAIN_URL } from "../constants";

export const TODO_API_URL = `${MAIN_URL}/todos`;

export const TOKEN: string =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1MjgxNTk2LCJleHAiOjE3MzUzMTc1OTZ9.22pPRsiVrgmXt1kzgfA4g_vx0XbC4K_JnRdR7viJsCg";

export const createTodo = async (
  todoPreparationContent: string,
  todoCreateAt: string,
  token: string
) => {
  const response = await axios.post<{ data: Todo }>(
    `http://localhost:4040/api/v1/todos/write`,
    {
      todoPreparationContent,
      todoCreateAt,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

day: Date();

export const updateTodo = async (
  todoId: number,
  data: Partial<{
    todoPreparationContent: string;
    todoCreateAt: string;
    todoStatus: string;
  }>,
  token: string
) => {
  const response = await axios.put<{ data: Todo }>(
    `http://localhost:4040/api/v1/todos/${todoId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const fetchTodos = async (token: string): Promise<Todo[]> => {
  const response = await axios.get<{ data: Todo[] }>(TODO_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};
export const fetchTodosByDay = async (
  day: string,
  token: string
): Promise<Todo[]> => {
  const response = await axios.get<{ data: Todo[] }>(
    `http://localhost:4040/api/v1/todos/day`,
    {
      params: { day },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const todos = response.data.data;

  if (!todos || todos.length === 0) {
    return [];
  }
  return todos;
};

export const deleteTodo = async (todoId: number, token: string) => {
  const response = await axios.delete(
    `http://localhost:4040/api/v1/todos/${todoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
