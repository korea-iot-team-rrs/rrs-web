export interface Todo {
    todoId: number;
    userId: number; // FK
    todoPreparationContent: string;
    todoCreateAt: Date
}

export interface TodoReqDto {
    "todoPreparationContent": string;
    "todoCreateAt": Date;
}

export interface TodoRespDto {
    "todoPreparationContent": string;
    "todoCreateAt": Date;
}
