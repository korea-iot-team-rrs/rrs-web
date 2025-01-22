import { create } from "zustand";

type DateStore = {
  formatDateToKR: (dateString: string) => string;
  formatDateBySlash: (date: Date) => string;
};

export const useDateStore = create<DateStore>(() => ({
  // 날짜를 한국 형식으로 포맷팅
  formatDateToKR: (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // 날짜를 YYYY-MM-DD 형식으로 포맷팅
  formatDateBySlash: (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
}));
