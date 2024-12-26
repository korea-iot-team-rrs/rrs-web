// apis

import axios from "axios";
import { Todo } from "../types/todoType";
import { ResponseDto } from "../types";
import { MAIN_URL } from "../constants";

const TODO_API_URL = `${MAIN_URL}/todos`;

export const createTodo = async (content: string, createAt: string) => {
  const response = await axios.post<{ data: Todo }>(TODO_API_URL, {
    content,
    createAt: Date.now(),
  });
  return response.data.data;
};

export const updateTodo = async (
  todoId: number,
  data: Partial<{ todoPreparationContent: string; todoCreateAt: string; todoStatus: string }>,
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

export const fetchTodos = async (id: number) => {
  const response = await axios.get<{ data: Todo[] }>(TODO_API_URL);
  return response.data.data;
};

export const fetchTodosByDay = async (
  day: string,
  token: string
): Promise<Todo[]> => {
  const response = await axios.get<{data: Todo[]}>(
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

export const deleteTodo = async (todoId: number) => {
  await axios.delete(`${TODO_API_URL}/${todoId}`);
};
