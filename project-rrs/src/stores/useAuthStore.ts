import { create } from "zustand";
import { LoginResponseDto, User } from "../types/AuthType";

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (response: LoginResponseDto) => void;
  logout: () => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

const getStoredData = () => {
  const storedUser = sessionStorage.getItem("user");
  const storedToken = sessionStorage.getItem("token");
  const tokenExpiration = sessionStorage.getItem("tokenExpiration");

  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const parsedToken = storedToken ? JSON.parse(storedToken) : null;
  const parsedExpiration = tokenExpiration
    ? Number(JSON.parse(tokenExpiration))
    : null;

  const isTokenValid = parsedExpiration && parsedExpiration > Date.now();

  if (!isTokenValid) {
    sessionStorage.clear();
    return { user: null, token: null };
  }

  return { user: parsedUser, token: parsedToken };
};

const useAuthStore = create<AuthState>((set) => {
  const { user: initialUser, token: initialToken } = getStoredData();

  return {
    isLoggedIn: !!initialUser && !!initialToken,
    user: initialUser,
    token: initialToken,

    setIsLoggedIn: (loggedIn: boolean) => set({ isLoggedIn: loggedIn }),

    login: (response: LoginResponseDto) => {
      const { token, exprTime, ...user } = response;
      const expirationTime = exprTime * 1000;
      const expirationDate = Date.now() + expirationTime;

      set({ isLoggedIn: true, token, user });

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", JSON.stringify(token));
      sessionStorage.setItem("tokenExpiration", JSON.stringify(expirationDate));

      if (expirationTime > 0) {
        setTimeout(() => {
          useAuthStore.getState().logout();
        }, expirationTime);
      }
    },

    logout: () => {
      set({ isLoggedIn: false, user: null, token: null });
      sessionStorage.clear();
    },

    updateUser: (user: Partial<User>) => {
      set((state) => {
        if (!state.user) return state;

        const updatedUser = {
          ...state.user,
          ...user,
        };

        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser };
      });
    },
  };
});

export default useAuthStore;
