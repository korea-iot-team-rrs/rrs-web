
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
    profileImageUrl: File | null; // 프로필 이미지 파일
    username: string; // 아이디
    password: string; // 비밀번호
    confirmPassword: string; // 비밀번호 확인
    name: string; // 이름
    nickname: string; // 닉네임
    address: string; // 주소
    addressDetail: string; // 상세 주소
    email: string; // 이메일
    phone: string; // 연락처
}

// 인증 DTO
export interface CertificateDto {
    email: string;
    username: string | null;
}