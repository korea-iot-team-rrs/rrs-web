export interface DangSitter {
  providerId: number;
  profileImageUrl: string;
  providerNickname: string;
  providerUsername: string;
  providerIntroduction: string;
  avgReviewScore: number;
}

export interface Pet {
  petId: number;
  petName: string;
  petImageUrl: string;
}

export interface User {
  username: string;
  nickname: string;
  phone: string;
  address: string;
}

export interface Reservation {
  reservationId: number;
  userId: number; // FK
  reservationStartDate: string;
  reservationEndDate: string;
  reservationStatus: ReservationStatus;
  providerInfo: DangSitter;
  reservationMemo: string;
}

export enum ReservationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface HasReviewResult {
  reviewStatus: string;
}

export interface GetReservation {
  reservationId: number;
  userId: number; // FK
  providerId: number; // FK
  reservationStartDate: string;
  reservationEndDate: string;
  reservationStatus: ReservationStatus;
  providerInfo: DangSitter;
  reservationMemo: string;
}
