export interface Todo {
  todoId: number;
  userId: number; // FK
  todoPreparationContent: string;
  todoCreateAt: string;
  todoStatus: string;
}
