import { css } from "@emotion/react";

export const container = css`
  display: flex;
  width: 100%;
  align-items: flex-start;
`;

export const listBox = css`
  list-style-type: none;
  line-height: 2;
  width: 200px;
  margin: 50px;
  padding: 25px;
  border-radius: 30px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: auto;
  overflow-y: auto;
`;

export const listItem = css`
  cursor: pointer;
  margin: 8px 0;
  &:hover {
    color: #2194ff;
  }
`;

export const contentArea = css`
  margin: 50px;
  flex-grow: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const tableStyle = css`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    text-align: center;
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
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
  }
`;

export const headerStyle = css`
  font-size: 24px;
  color: black;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const numberColumn = css`
  width: 10%;
`;

export const titleColumn = css`
  width: 70%;
`;

export const dateColumn = css`
  width: 20%;
`;
