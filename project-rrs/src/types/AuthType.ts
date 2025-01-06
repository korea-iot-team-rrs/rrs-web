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

export interface findId {
    email: string;
}
export interface findPassword {
    email: string;
    username: string;
}