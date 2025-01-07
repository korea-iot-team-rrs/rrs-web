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
}
export interface CertificateDto {
    email: string;
    username: string | null;
}