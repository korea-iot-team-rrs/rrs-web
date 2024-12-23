/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import usePagination from './usePagination';
import { listItem, listBox, contentArea, container, tableStyle, paginationContainer, pageButton, headerStyle } from './Style';

interface MenuData {
  [key: string]: {
    title: string;
    content: string[];
  };
}

const menuData: MenuData = {
  '공지사항': {
    title: '공지사항',
    content: new Array(20).fill(null).map((_, i) => `공지사항 내용 ${i + 1}`)
  },
  '사용방법': {
    title: '사용방법',
    content: new Array(15).fill(null).map((_, i) => `사용방법 설명 ${i + 1}`)
  },
  '이벤트': {
    title: '이벤트',
    content: ['할인 이벤트 발표', '신제품 출시 정보', '특별 프로모션 안내']
  }
};

export default function Announcement() {
  const [currentMenu, setCurrentMenu] = useState<string>('공지사항');
  const { currentData, next, prev, currentPage, maxPage } = usePagination<string>(menuData[currentMenu].content, 10);

  const handleMenuClick = (menu: string) => {
    setCurrentMenu(menu);
  };

  return (
    <div css={container}>
      <ul css={listBox}>
        {Object.keys(menuData).map((menu, index) => (
          <li key={index} css={listItem} onClick={() => handleMenuClick(menu)}>
            {menu}
          </li>
        ))}
      </ul>
      <div css={contentArea}>
        <h1 css={headerStyle}>{menuData[currentMenu].title}</h1>  {/* Display the title of the selected menu */}
        <table css={tableStyle}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>등록 날짜</th>
            </tr>
          </thead>
          <tbody>
            {currentData().map((item, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{item}</td>
                <td>{new Date().toISOString().split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div css={paginationContainer}>
          <button css={pageButton} onClick={prev} disabled={currentPage === 1}>Prev</button>
          <span> Page {currentPage} of {maxPage} </span>
          <button css={pageButton} onClick={next} disabled={currentPage === maxPage}>Next</button>
        </div>
      </div>
    </div>
  );
}
