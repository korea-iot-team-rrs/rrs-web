// src/hooks/usePagination.ts
import { useState } from 'react';

interface Pagination<T> {
  currentData: () => T[];
  next: () => void;
  prev: () => void;
  jump: (page: number) => void;
  currentPage: number;
  maxPage: number;
}

function usePagination<T>(data: T[], itemsPerPage: number): Pagination<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData(): T[] {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next(): void {
    setCurrentPage((current) => Math.min(current + 1, maxPage));
  }

  function prev(): void {
    setCurrentPage((current) => Math.max(current - 1, 1));
  }

  function jump(page: number): void {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  }

  return { currentData, next, prev, jump, currentPage, maxPage };
}

export default usePagination;
