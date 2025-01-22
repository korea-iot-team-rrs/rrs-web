//entity들
export interface ResponseDto<D> {
  result: boolean;
  message: string;
  data: D;
}
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
  todoCreateAt: Date;
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
  reservationId: number;
  userId: number; // FK
  prviderId: number; // FK
  reservationStartDate: Date;
  reservationEndDate: Date;
  reservationStatus: ReservationStatus;
  reservationMemo: string;
}

export enum ReservationStatus {
  PENDING,
  IN_PROGRESS,
  REJECTED,
  CANCELLED,
  COMPLETED,
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

export interface Pet {
  petId: number;
  userId: number;
  petName: string;
  petGender: string;
  petBirthDate: string;
  petWeight: number;
  petImageUrl: string;
  petAddInfo?: string;
  petNeutralityYn: string;
}
