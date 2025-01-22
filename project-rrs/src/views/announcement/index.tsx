import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import {
  container,
  listBox,
  listItem,
  contentArea,
  tableStyle,
  paginationContainer,
  headerStyle,
  numberColumn,
  titleColumn,
  dateColumn,
} from "./Style"; // 스타일 파일 경로 확인

interface AnnouncementData {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function Announcement() {
  const [announcementData, setAnnouncementData] = useState<AnnouncementData[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentMenu, setCurrentMenu] = useState<string>("공지사항");

  const fetchPosts = async (menu: string, page: number) => {
    if (menu === "공지사항") {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/announcements?category=${menu}&page=${page}&size=10`
        );
        const data = response.data.data;
        setAnnouncementData(
          data.map((item: any) => ({
            id: item.announcementId,
            title: item.announcementTitle,
            content: item.announcementContent,
            date: new Date(item.announcementCreatedAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          }))
        );
        setTotalPages(data.totalPages);
        setCurrentPage(data.page || 1);
      } catch (e) {
        console.error("Failed to fetch announcement data", e);
        setAnnouncementData([]);
      }
    }
  };

  useEffect(() => {
    fetchPosts(currentMenu, currentPage - 1);
  }, [currentMenu, currentPage]);

  const handleMenuClick = (menu: string) => {
    setCurrentMenu(menu);
    setCurrentPage(1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreSectionClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextSectionClick = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div css={container}>
      <ul css={listBox}>
        {["공지사항", "사용방법", "이벤트"].map((menu, index) => (
          <li key={index} css={listItem} onClick={() => handleMenuClick(menu)}>
            {menu}
          </li>
        ))}
      </ul>
      <div css={contentArea}>
        <h1 css={headerStyle}>{currentMenu}</h1>
        <table css={tableStyle}>
          <thead>
            <tr>
              <th css={numberColumn}>번호</th>
              <th css={titleColumn}>제목</th>
              <th css={dateColumn}>등록 날짜</th>
            </tr>
          </thead>
          <tbody>
            {announcementData.map((post, index) => (
              <tr key={index}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td css={dateColumn}>{post.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pageList={Array.from(Array(totalPages).keys())}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
          handlePreSectionClick={handlePreSectionClick}
          handleNextSectionClick={handleNextSectionClick}
        />
      </div>
    </div>
  );
}
