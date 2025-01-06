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

const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

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