import axios from "axios";
import { TodoRespDto } from '../types/todoType'

const TODO_API_URL = `%{MAIN_URL}/todos`

export const createTodo = async ( content: string, createAt: Date ) => {
  const response = await axios.post<{ data: TodoRespDto }>(TODO_API_URL, {content, createAt: Date.now()});
  return response.data.data;
}

export const updateTodo = async ( todoId :number , constent: string, createaAt: Date, status: number) => {
  const response = await axios.post<{ data : TodoRespDto }>(`${TODO_API_URL}/${todoId}`, { constent, createaAt, status })
  return response.data.data;
}

export const fetchTodos = async () => {
  const response = await axios.get<{ data: TodoRespDto[] }>(TODO_API_URL);
  return response.data.data;
}

export const fetchTodosByDay = async ( day: Date ) => {
  const response = await axios.get<{ data: TodoRespDto[] }>(TODO_API_URL, { params: { day } });
  return response.data.data;
}

export const deleteTodo = async ( todoId :number ) => {
  await axios.delete(`${TODO_API_URL}/${todoId}`)
}