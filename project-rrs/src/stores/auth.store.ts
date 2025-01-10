import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  updateUser: (user: User) => void;
}

interface User {
  username: string;
  name: string;
  nickname: string;
  address: string;
  addressDetail: string;
  email: string;
  phone: string;
  profileImageUrl: string;
}

let parsedUser: User | null = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    parsedUser = JSON.parse(storedUser) as User;
  }
} catch (error) {
  console.error("localStorage에서 사용자 정보를 파싱하는 데 실패했습니다:", error);
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!parsedUser,
  user: parsedUser,

  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

  login: (token, user) => {
    set({ isLoggedIn: true, user });
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    set({ isLoggedIn: false, user: null });
    localStorage.removeItem("user");
  },

  updateUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  }
}));

export default useAuthStore;