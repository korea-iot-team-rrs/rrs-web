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

export const fetchTodosByDay = async (
  userId: number,
  day: string,
  token: string
): Promise<TodoRespDto[]> => {
  try {
    const response = await axios.get<ResponseDto<TodoRespDto[]>>(
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

    // 빈 배열일 경우 빈 배열을 반환
    if (!todos || todos.length === 0) {
      console.log("No todos found for the selected day.");
      return [];
    }

    return todos;
  } catch (error) {
    console.error("Failed to fetch todo data", error);
    return []; // 오류가 발생하면 빈 배열을 반환
  }
};

export const deleteTodo = async ( todoId :number ) => {
  await axios.delete(`${TODO_API_URL}/${todoId}`)
}