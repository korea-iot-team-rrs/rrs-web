//entity들

export interface User {
    userId: number;
    name: string;
    username: string;
    password: string;
    nickname: string;
    phone: string;
    address: string;
    addressDetail: string;
    email: string;
    profileImageUrl: string;
    roles: string;
    providerIntroduction: string;
}

export interface Todo {
    todoId: number;
    userId: number; // FK
    todoPreparationContent: string;
    todoCreateAt: Date
}

export interface Review {
    reviewId: number; 
    userId: number; // FK
    reservationId: number; // FK
    reviewCreatedAt: Date;
    reviewScore: number;
    reviewContent: string;
}

export interface Reservation {
    reservationId: number
    userId: number; // FK
    prviderId: number // FK
    reservationStartDate: Date;
    reservationEndDate: Date;
    reservationStatus: ReservationStatus
}

export enum ReservationStatus {
    PENDING = '예약대기',
    IN_PROGRESS = '예약 진행중',
    REJECTED = '거절',
    CANCELLED = '취소',
    COMPLETED = '완료'
  }

export interface CustomerSupportAttachment {
    customerSupportAttachmentId: number;
    customerSupportId: number; // FK
    customerAttachmentFile: string;
}

export interface CustomerSupport {
    reviewId: number;
    userId: number; // FK
    customerSupportTitle: string;
    customerSupportContent: string;
    customerSupportStatus: number;
    customerSupportCreateAt: Date;
    customerSupportCategory: string;
}