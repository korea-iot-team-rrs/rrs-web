export interface Pet {
  petId: number;
  petName: string;
  petImageUrl: string;
  petGender: string;
  petBirthDate: string;
  petWeight: number;
  petAddInfo?: string;
  petNeutralityYn: string;
}

export interface UserInfo {
  userId: number;
  nickname: string;
  phone: string;
  address: string;
  profileImageUrl: string;
}

export enum ReservationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Provision {
  reservationId: number;
  providerId: number; // FK
  reservationStartDate: string;
  reservationEndDate: string;
  reservationMemo: string;
  reservationStatus: ReservationStatus;
  userId: number;
  nickname: string;
  phone: string;
  address: string;
  profileImageUrl: string;
  pets: Pet[];
}

export interface ProvisionSummary {
  reservationId: number;
  providerId: number; // FK
  reservationStartDate: string;
  reservationEndDate: string;
  reservationStatus: ReservationStatus;
  userId: number;
  nickname: string;
}

export interface ProvisionList {
  provisionList: ProvisionSummary[];
}
