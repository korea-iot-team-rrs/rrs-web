import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../pagination";
import "../../../styles/announcement/announcement.css";
import { MAIN_URL } from "../../../constants";

interface UsageGuideData {
  id: number;
  title: string;
  content: string;
  date: string;
}

export default function UsageGuideList() {
  const [allData, setAllData] = useState<UsageGuideData[]>([]);
  const [usageGuideData, setUsageGuideData] = useState<UsageGuideData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentMenu, setCurrentMenu] = useState<string>("사용방법");
  const navigate = useNavigate();

  const pageSize = 10;

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${MAIN_URL}/usageGuide`);
      const data = response.data.data;
      const sortedData = data
        .map((item: any) => ({
          id: item.guideId,
          title: item.guideTitle,
          content: item.guideContent,
          date: new Date(item.guideCreatedAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        }))
        .sort((a: UsageGuideData, b: UsageGuideData) => b.id - a.id);

      setAllData(sortedData);
      setTotalPages(Math.ceil(sortedData.length / pageSize));
    } catch (e) {
      console.error("Failed to fetch usage guide data", e);
      setAllData([]);
    }
  };

  useEffect(() => {
    if (currentMenu === "사용방법") {
      fetchPosts();
      navigate("/usage-guide");
    } else if (currentMenu === "공지사항") {
      navigate("/announcements");
    } else if (currentMenu === "이벤트") {
      navigate("/events");
    }
  }, [currentMenu, navigate]);

  useEffect(() => {
    if (currentMenu === "사용방법") {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setUsageGuideData(allData.slice(startIndex, endIndex));
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
    if (id !== 0) navigate(`/usage-guide/${id}`);
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
    <div className="announcement-container">
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
            {usageGuideData.map((post) => (
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
