/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";
import "../../../styles/Announcement.css";
import { MAIN_URL } from "../../../constants";

interface EventData {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function EventList() {
  const [allData, setAllData] = useState<EventData[]>([]);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentMenu, setCurrentMenu] = useState<string>("이벤트");
  const navigate = useNavigate();

  const pageSize = 10;

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${MAIN_URL}/events`);
      const data = response.data.data;
      const sortedData = data
        .map((item: any) => ({
          id: item.eventId,
          title: item.eventTitle,
          content: item.eventContent,
          date: new Date(item.eventCreatedAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        }))
        .sort((a: EventData, b: EventData) => b.id - a.id);

      setAllData(sortedData);
      setTotalPages(Math.ceil(sortedData.length / pageSize));
    } catch (e) {
      console.error("Failed to fetch event data", e);
      setAllData([]);
    }
  };

  useEffect(() => {
    if (currentMenu === "이벤트") {
      fetchPosts();
      navigate("/events");
    } else if (currentMenu === "공지사항") {
      navigate("/announcements");
    } else if (currentMenu === "사용방법") {
      navigate("/usageGuide");
    }
  }, [currentMenu]);

  useEffect(() => {
    if (currentMenu === "이벤트") {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setEventData(allData.slice(startIndex, endIndex));
    }
  }, [currentPage, allData, currentMenu]);

  const handleMenuClick = (menu: string) => {
    setCurrentMenu(menu);
    setCurrentPage(1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleTitleClick = (id: number) => {
    if (id !== 0) navigate(`/events/${id}`);
  };

  const handlePreSectionClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextSectionClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="event-container">
      <ul className="list-box">
        {["공지사항", "사용방법", "이벤트"].map((menu, index) => (
          <li
            key={index}
            className="list-item"
            onClick={() => handleMenuClick(menu)}
          >
            {menu}
          </li>
        ))}
      </ul>
      <div className="content-area">
        <h1 className="header-style">{currentMenu}</h1>
        <table className="table-style">
          <thead>
            <tr>
              <th>순번</th>
              <th>제목</th>
              <th>등록 날짜</th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((post) => (
              <tr key={post.id}>
                <td className="number-column">{post.id || "-"}</td>
                <td
                  className={`title-column ${post.id !== 0 ? "clickable" : ""}`}
                  onClick={() => handleTitleClick(post.id)}
                >
                  {post.title}
                </td>
                <td className="date-column">{post.date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pageList={Array.from(Array(totalPages), (_, i) => i + 1)}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
          handlePreSectionClick={handlePreSectionClick}
          handleNextSectionClick={handleNextSectionClick}
        />
      </div>
    </div>
  );
}
