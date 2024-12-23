// Style.ts
import { css } from '@emotion/react';

export const container = css`
  display: flex;
  width: 100%;
  align-items: flex-start; // 상단 정렬
`;

export const listBox = css`
  width: 200px;
  margin-right: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: auto;
  overflow-y: auto;
`;

export const listItem = css`
  cursor: pointer;
  margin: 5px 0;
  &:hover {
    background-color: #f4f4f4;
  }
`;

export const contentArea = css`
  flex-grow: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  th, td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #eee;
  }
  th {
    background-color: #f9f9f9;
  }
`;

export const paginationContainer = css`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

export const pageButton = css`
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
  }
  
`;export const headerStyle = css`
font-size: 24px; // 글자 크기 설정
color: #333; // 글자색
margin-bottom: 20px; // 하단 여백
padding: 10px 0; // 상하 패딩
border-bottom: 1px solid #ddd; // 하단 테두리
`;
