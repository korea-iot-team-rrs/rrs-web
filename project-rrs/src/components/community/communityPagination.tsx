import React from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "../../styles/community/communityPagination.css";

interface PaginationProps {
  pageList: number[];
  currentPage: number;
  handlePageClick: (page: number) => void;
  handlePreSectionClick: () => void;
  handleNextSectionClick: () => void;
}

export default function CommunityPagination({
  pageList,
  currentPage,
  handlePageClick,
  handlePreSectionClick,
  handleNextSectionClick,
}: PaginationProps) {
  return (
    <div className="community-pagination-box">
      <button
        className="community-pagination-button"
        onClick={handlePreSectionClick}
        disabled={currentPage === 1}
      >
        <AiOutlineLeft size={24} />
      </button>

      <div className="community-pagination-list">
        {pageList.map((page) => (
          <div
            key={page}
            className={`community-pagination-item ${
              page === currentPage
                ? "community-pagination-active"
                : "community-pagination-inactive"
            }`}
            onClick={() => page !== currentPage && handlePageClick(page)}
          >
            {page}
          </div>
        ))}
      </div>

      <button
        className="community-pagination-button"
        onClick={handleNextSectionClick}
        disabled={currentPage === pageList.length}
      >
        <AiOutlineRight size={24} />
      </button>
    </div>
  );
}
