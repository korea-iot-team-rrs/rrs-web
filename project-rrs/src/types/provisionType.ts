export interface Pet {
  petId: number
  petName: string;
  petImageUrl: string;
  petGender: string;
  petBirthDate: string;
  petWeight: string;
  petAddInfo: string;
  petNeutralityYn: string;
}

export interface  User {
  userId: number;
  nickname: string;
  phone: string;
  address: string;
}

export enum ReservationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export interface Provision {
  reservationId: number;
  providerId: number; // FK
  reservationStartDate: string;
  reservationEndDate: string;
  pets: Pet;
  user: User;
  reservationMemo: string;
  reservationStatus: ReservationStatus;
}