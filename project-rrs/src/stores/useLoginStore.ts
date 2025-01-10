import { create } from "zustand";

type LoginState = {
  isLogin: boolean;
  setLogin: (value: boolean) => void; 
};

export const useLoginStore = create<LoginState>((set) => ({
  isLogin: false,
  setLogin: (value: boolean) => set({ isLogin: value }),
}));
