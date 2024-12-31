export interface Review {
    reviewId: number; 
    userId: number; // FK
    reservationId: number; // FK
    profileImageUrl: string;
    username: string;
    userNickname: string;
    reviewCreatedAt: Date;
    reviewScore: number;
    reviewContent: string;
}