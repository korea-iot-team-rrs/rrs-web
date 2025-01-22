/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

interface PaginationProps {
  pageList: number[];
  currentPage: number;
  handlePageClick: (page: number) => void;
  handlePreSectionClick: () => void;
  handleNextSectionClick: () => void;
}

const communitypaginationBoxStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 24px;
`;

const communitybuttonStyle = css`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e2e8f0;
  }

  &:focus {
    outline: 2px solid #1a73e8;
  }
`;

const communitypageListStyle = css`
  display: flex;
  gap: 16px;
`;

const pageStyle = (isActive: boolean) => css`
  color: ${isActive ? "#1a73e8" : "#6b7280"};
  font-size: 14px;
  font-weight: ${isActive ? "700" : "400"};
  cursor: ${isActive ? "default" : "pointer"};
  transition: color 0.3s;

  &:hover {
    color: ${!isActive && "#374151"};
  }
`;

export default function Pagination({
  pageList,
  currentPage,
  handlePageClick,
  handlePreSectionClick,
  handleNextSectionClick,
}: PaginationProps) {
  return (
    <div css={communitypaginationBoxStyle}>
      <button
        css={communitybuttonStyle}
        onClick={handlePreSectionClick}
        disabled={currentPage === 1}
      >
        <AiOutlineLeft size={24} />
      </button>

      <div css={communitypageListStyle}>
        {pageList.map((page) => (
          <div
            key={page}
            css={pageStyle(page === currentPage)}
            onClick={() => page !== currentPage && handlePageClick(page)}
          >
            {page}
          </div>
        ))}
      </div>

      <button
        css={communitybuttonStyle}
        onClick={handleNextSectionClick}
        disabled={currentPage === pageList.length}
      >
        <AiOutlineRight size={24} />
      </button>
    </div>
  );
}
