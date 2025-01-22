import { create } from "zustand";

interface RefreshStore {
  refreshKey: number;
  incrementRefreshKey: () => void;
}

export const useRefreshStore = create<RefreshStore>((set) => ({
  refreshKey: 0,
  incrementRefreshKey: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
