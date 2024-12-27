import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
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

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,

  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

  login: (token, user) => {
    set({ isLoggedIn: true, user });
  },

  logout: () => {
    set({ isLoggedIn: false, user: null });
  }
}));

export default useAuthStore;