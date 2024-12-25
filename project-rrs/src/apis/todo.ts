import axios from "axios";
import { TodoRespDto } from '../types/todoType'
import { ResponseDto } from "../types";

const TODO_API_URL = `%{MAIN_URL}/todos`

export const createTodo = async ( content: string, createAt: Date ) => {
  const response = await axios.post<{ data: TodoRespDto }>(TODO_API_URL, {content, createAt: Date.now()});
  return response.data.data;
}

export const updateTodo = async ( todoId :number , constent: string, createaAt: Date, status: number) => {
  const response = await axios.post<{ data : TodoRespDto }>(`${TODO_API_URL}/${todoId}`, { constent, createaAt, status })
  return response.data.data;
}

export const fetchTodos = async (id: number) => {
  const response = await axios.get<{ data: TodoRespDto[] }>(TODO_API_URL);
  return response.data.data;
}

export const fetchTodosByDay = async (userId: number ,day: string, token: string): Promise<TodoRespDto[]> => {
  const response = await axios.get<ResponseDto<TodoRespDto[]>>(`http://localhost:4040/api/v1/todos/day`, {
    params: { day },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.data.result) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const deleteTodo = async ( todoId :number ) => {
  await axios.delete(`${TODO_API_URL}/${todoId}`)
}