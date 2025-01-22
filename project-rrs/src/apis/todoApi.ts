import axios from "axios";
import { Todo } from "../types/todoType";
import {
  MAIN_URL,
  TODO_POST_PATH,
  TODO_GET_ALL_PATH,
  TODO_GET_BY_DATE_PATH,
  TODO_PUT_PATH,
  TODO_DELETE_PATH,
} from "../constants";

export const createTodo = async (
  todoPreparationContent: string,
  todoCreateAt: string,
  token: string
) => {
  const response = await axios.post<{ data: Todo }>(
    `${MAIN_URL}${TODO_POST_PATH}`,
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

export const fetchTodos = async (token: string): Promise<Todo[]> => {
  const response = await axios.get<{ data: Todo[] }>(
    `${MAIN_URL}${TODO_GET_ALL_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const fetchTodosByDay = async (
  day: string,
  token: string
): Promise<Todo[]> => {
  const response = await axios.get<{ data: Todo[] }>(
    `${MAIN_URL}${TODO_GET_BY_DATE_PATH}`,
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
    `${MAIN_URL}${TODO_PUT_PATH(todoId)}`,
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

export const deleteTodo = async (todoId: number, token: string) => {
  const response = await axios.delete(
    `${MAIN_URL}${TODO_DELETE_PATH(todoId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
