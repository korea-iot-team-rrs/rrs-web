
export interface User {
    userId: number;
    name: string;
    username: string;
    nickname: string;
    phone: string;
    address: string;
    addressDetail: string;
    email: string;
    profileImageUrl: string | null;
    roles: string;
    providerIntroduction: string | null;
}

// 로그인 응답 DTO
export interface LoginResponseDto extends Omit<User, 'profileImageUrl' | 'providerIntroduction'> {
    profileImageUrl: string;  
    providerIntroduction: string; 
    token: string;
    exprTime: number;
}

// 회원가입 인터페이스
export interface UserSignUp {
    profileImageUrl: string;
    name: string;
    username: string;
    password: string;
    comfirmPassword: string;
    nickname: string;
    phone: string;
    address: string;
    addressDetail: string;
    email: string;
    joinPath: string;
    snsId: string | null;
}

// 인증 DTO
export interface CertificateDto {
    email: string;
    username: string | null;
}