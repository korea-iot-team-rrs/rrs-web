export interface Todo {
    todoId: number;
    userId: number; // FK
    todoPreparationContent: string;
    todoCreateAt: string;
    todoStatus: string;
}

export interface TodoReqDto {
    todoPreparationContent: string;
    todoCreateAt: string;
    todoStatus: string;
}

export interface TodoRespDto {
    todoPreparationContent: string;
    todoCreateAt: string;
    todoStatus: string;
}
