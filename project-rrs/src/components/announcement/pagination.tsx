import React from "react";
import "../../styles/announcement/paginationAnnouncement.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

interface PaginationProp {
  pageList: number[];
  currentPage: number;

  handlePageClick: (page: number) => void;

  handlePreSectionClick: () => void;
  handleNextSectionClick: () => void;
}

export default function Pagination({
  pageList,
  currentPage,
  handlePageClick,
  handlePreSectionClick,
  handleNextSectionClick,
}: PaginationProp) {
  return (
    <div className="pagination-announcement-box">
      <button
        className="pagination-announcement-button"
        onClick={handlePreSectionClick}
      >
        <AiOutlineLeft size={24} />
      </button>

      <div className="pagination-announcement-list">
        {pageList.map((page) => (
          <div
            key={page}
            className={`pagination-announcement-item ${
              page === currentPage
                ? "pagination-announcement-active"
                : "pagination-announcement-inactive"
            }`}
            onClick={() => page !== currentPage && handlePageClick(page)}
          >
            {page}
          </div>
        ))}
      </div>

      <button
        className="pagination-announcement-button"
        onClick={handleNextSectionClick}
      >
        <AiOutlineRight size={24} />
      </button>
    </div>
  );
}
