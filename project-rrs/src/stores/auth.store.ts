import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

interface User {
  profileImageUrl: string;
  nickname: string;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,

  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ isLoggedIn: true, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isLoggedIn: false, user: null });
  }
}));

export default useAuthStore;