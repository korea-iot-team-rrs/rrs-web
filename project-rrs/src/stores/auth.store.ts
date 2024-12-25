// zustand 파일명 권장
// : 전역상태관리할데이터명.store.ts
// EX) user.store.ts

import { create } from "zustand";

//* interface *//
//# 인증 상태에 저장할 사용자 interface 정의 //
interface User {
  userId: number;
  name: string;
  username: string;
  password: string;
  nickname: string;
  phone: string;
  address: string;
  addressDetail: string;
  email: string;
  profileImageUrl: string;
  roles: string;
  providerIntroduction: string;
}

//# 인증상태의 interface 정의 //
interface AuthStoreType {
  // 상태 필드 정의
  isAuthenticated: boolean; // 인증 여부를 나타냄
  user: User | null; // 사용자 정보를 담은 객체 또는 null

  // 상태 업데이트 함수
  login: (user: User) => void;
  logout: () => void;
}

// 저장소 생성 함수
const useAuthStore = create<AuthStoreType>((set) => ({
  // 상태 필드 초기화
  isAuthenticated: false,
  user: null,

  // 상태 업데이트 함수
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
