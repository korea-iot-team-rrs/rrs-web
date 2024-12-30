export interface Review {
    reviewId: number; 
    userId: number; // FK
    reservationId: number; // FK
    reviewCreatedAt: Date;
    reviewScore: number;
    reviewContent: string;
}