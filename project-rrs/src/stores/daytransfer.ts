import { create } from 'zustand';

type DateStore = {
  formatDate: (dateString: string) => string;
};


// 예시) 2024년 2월 6일 오전 10:00
export const useDateStore = create<DateStore>((set) => ({
  formatDate: (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
}));