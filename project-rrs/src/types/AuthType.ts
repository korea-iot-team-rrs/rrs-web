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
export interface CertificateDto {
    email: string;
    username: string | null;
}