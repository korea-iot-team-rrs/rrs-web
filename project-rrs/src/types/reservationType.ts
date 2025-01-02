export interface DangSitter {
    providerId: number;
    profileImageUrl: string
    providerNickname: string;
    providerUsername: string;
    providerIntroduction: string;
    avgReviewScore: number;
}

export interface Pet {
    petName: string;
    petImageUrl: string;
}

export interface User {
    username: string;
    nickname: string;
    phone: string;
    address: string;
}