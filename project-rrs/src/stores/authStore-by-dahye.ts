import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (response: LoginResponseDto) => void;
  logout: () => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  updateUser: (user: User) => void;
}

interface User {
  userId: number;
  name: string;
  username: string;
  nickname: string;
  phone: string;
  address: string;
  addressDetail: string;
  email: string;
  profileImageUrl: string;
  roles: string;
  providerIntroduction: string;
}

interface LoginResponseDto {
  userId: number;
  name: string;
  username: string;
  nickname: string;
  phone: string;
  address: string;
  addressDetail: string;
  email: string;
  profileImageUrl: string;
  roles: string;
  providerIntroduction: string;
  token: string;
  exprTime: number;
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;
const parsedToken = storedToken ? JSON.parse(storedToken) : null;

const useAuthStore_Dahye = create<AuthState>((set) => ({
  isLoggedIn: !!parsedUser && !!parsedToken,
  user: parsedUser,
  token: parsedToken,

  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  
  login: (response) => {
    const {
      token,
      exprTime,
      ...user
    } = response;

    set({ isLoggedIn: true, user, token });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));
  },

  logout: () => {
    set({ isLoggedIn: false, user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  updateUser: (user) => {
    set((state) => ({ user: { ...state.user, ...user } }));
    localStorage.setItem("user", JSON.stringify(user));
  }
}));
