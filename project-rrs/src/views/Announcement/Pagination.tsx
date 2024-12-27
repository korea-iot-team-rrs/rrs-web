import React from 'react';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

interface PaginationProp {
  pageList: number[];
  currentPage: number;

  handlePageClick: (page: number) => void;

  handlePreSectionClick: () => void;
  handleNextSectionClick: () => void;
}

const paginationBoxStyle = css`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const buttonStyle = css`
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
    outline: 2px solid #1a73e8
  }
`;

const pageListStyle = css`
  display: flex;
  gap: 16px;
`;

const pageStyle = (isActive: boolean) => css`
  color: ${isActive ? '#1a73e8' : '#6b7280'};
  font-size: 14px;
  font-weight: ${isActive ? '700' : '400'};
  cursor: ${isActive ? 'default' : 'pointer'};
  transition: color 0.3s;

  &:hover {
    color: ${!isActive && '#374151'};
  }
`;

export default function Pagination({
  pageList,
  currentPage,
  handlePageClick,
  handlePreSectionClick,
  handleNextSectionClick
}: PaginationProp) {
  return (
    <div css={paginationBoxStyle}>

      <button 
        css={buttonStyle}
        onClick={handlePreSectionClick}
      >
        <AiOutlineLeft size={24} />
      </button>

      <div css={pageListStyle}>

        {pageList.map(page => (
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
        css={buttonStyle}
        onClick={handleNextSectionClick}
      >
        <AiOutlineRight size={24} />
      </button>
    </div>
  )
}
